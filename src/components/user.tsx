"use client"
import { useUser } from "@/hooks/useUser";
import Loading from "@/components/loading";
import Image from "next/image";

export function UserPortrait({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const { user, loading, error } = useUser();

  if (loading) {
    return <Loading height="h-4" />;
  }
  
  if (error) {
    return <p className="text-red-500">Failed to load user information</p>;
  }

  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };

  return (
    <div className={`relative ${sizes[size]} rounded-full`}>
      {user?.portrait ? (
        <Image
          src={user.portrait}
          alt={`${user?.name}'s portrait`}
          fill
          className="object-cover"
        />
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`${sizes[size]} object-cover`}>
          <title>{user?.name} portrait</title>
          <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
        </svg>
      )}
    </div>
  );
}

export function UserName() {
  const { user, loading, error } = useUser();

  if (loading) {
    return <Loading height="h-4" />;
  }
  
  if (error) {
    return <p className="text-red-500">Failed to load user information</p>;
  }

  return <>{user?.name}</>;
}