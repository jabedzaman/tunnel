import { IJWTPayload, Role } from "@tunnel/interfaces";
import type { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { config } from "~/config";
import { userService } from "~/modules";
import { ApiError, httpStatus } from "~/utils";

type AuthOptions = {
  required?: boolean; // to require authentication, defaults to true
  roles?: Role[]; // to restrict access to specific roles
  permissions?: string[]; // to restrict access to specific permissions
  permissionsAny?: string[]; // to restrict access to specific permissions
  minRoleLevel?: number; // to restrict access to users with a specific role level
  ownershipField?: (req: Request) => string; // to check ownership of a resource
};

export const authenticate = (
  options: AuthOptions = {
    required: true, // default to requiring authentication
  }
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies.token ||
        req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        if (options.required) {
          throw new ApiError(
            "Authentication token is required",
            httpStatus.UNAUTHORIZED
          );
        } else {
          return next(); // Optional auth, just continue
        }
      }

      // Verify the JWT token
      const decoded = jwt.verify(
        token,
        config.ACCESS_TOKEN_PUBLIC_KEY
      ) as IJWTPayload;

      const user = await userService.getUser(decoded.sub);
      // Check if user exists and is not deactivated
      if (!user || user.deactivatedAt) {
        throw new ApiError(
          "User not found or deactivated",
          httpStatus.UNAUTHORIZED
        );
      }

      // Attach user and permissions to the request object
      req.user = decoded;
      // ##FIXME: uncomment this when we have permissions
      // req.permissions = [...user.role.permissions, ...user.permissions].map(
      //   (p) => `${p.resource}:${p.action}`
      // );

      // check if user has the required role
      if (options.roles && !options.roles.includes(user.role.name)) {
        throw new ApiError(
          "Access denied: insufficient role",
          httpStatus.FORBIDDEN
        );
      }

      // check if user has the required role level
      if (options.minRoleLevel && user.role.level < options.minRoleLevel) {
        throw new ApiError(
          "Access denied: insufficient role level",
          httpStatus.FORBIDDEN
        );
      }

      // check if user has the required permissions
      if (
        options.permissionsAny &&
        !options.permissionsAny.some((p) => req.permissions!.includes(p))
      ) {
        throw new ApiError(
          "Access denied: missing required permission(s)",
          httpStatus.FORBIDDEN
        );
      }

      // check if user has all required permissions
      if (
        options.permissions &&
        !options.permissions.every((p) => req.permissions!.includes(p))
      ) {
        throw new ApiError(
          "Access denied: missing required permission(s)",
          httpStatus.FORBIDDEN
        );
      }

      // Ownership check
      if (options.ownershipField) {
        const resourceUserId = options.ownershipField(req);
        const isOwner = user.id === resourceUserId;
        const isAdmin = ["admin", "super_admin"].includes(user.role.name);
        if (!isOwner && !isAdmin) {
          throw new ApiError("Not owner or admin", httpStatus.FORBIDDEN);
        }
      }

      next();
    } catch (err) {
      if (options.required) {
        throw new ApiError(
          "Invalid authentication token",
          httpStatus.UNAUTHORIZED
        );
      } else {
        next(); // Optional auth
      }
    }
  };
};
