"use client";

import { useUser } from "@clerk/nextjs";
import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: ("wholesaler" | "retailer")[];
  fallback?: ReactNode;
}

/**
 * Client-side role guard component
 * Shows children only if user has one of the allowed roles
 */
export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const { user, isLoaded } = useUser();
  
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-navy" />
      </div>
    );
  }

  const userRole = user?.unsafeMetadata?.role as "wholesaler" | "retailer" | undefined;
  
  if (!userRole || !allowedRoles.includes(userRole)) {
    return fallback || null;
  }

  return <>{children}</>;
}

interface WholesalerOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Show content only to wholesalers
 */
export function WholesalerOnly({ children, fallback }: WholesalerOnlyProps) {
  return (
    <RoleGuard allowedRoles={["wholesaler"]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

interface RetailerOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Show content only to retailers
 */
export function RetailerOnly({ children, fallback }: RetailerOnlyProps) {
  return (
    <RoleGuard allowedRoles={["retailer"]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}
