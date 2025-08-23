"use client"
import React, { useActionState, useEffect, useRef, useState } from 'react';
import NextImage from "next/image";
import CloseRouter from "@/components/CloseRouter";
import ImageIO from './ImageIO';
import { updateProfile } from '@/actions';
import { useRouter } from 'next/navigation';

type User = {
    cover: string | null;
    img: string | null;
    bio: string | null;
    displayName: string | null;
    location: string | null;
    job: string | null;
    website: string | null;
    username: string;
}
const UpdateUserProfileClient = ({ user }: { user: User }) => {

    const formRef = useRef<HTMLFormElement | null>(null);
    const router = useRouter();
      const closeModal = () => {
        router.back();
      };

    const [cover, setCover] = useState<File | null>();
    const [profile, setProfile] = useState<File | null>();

  const handleCoverPicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCover(e.target.files[0]);
    }
  };
  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfile(e.target.files[0]);
    }
  };

  const previewCoverPicURL = cover ? URL.createObjectURL(cover) : null;
  const previewProfilePicURL = profile ? URL.createObjectURL(profile) : null;

  const [state, formAction, isPending] = useActionState(updateProfile, {
      success: false,
      error: false,
    });

    useEffect(() => {
        if (state.success) {
          formRef.current?.reset();
          setCover(null);
          setProfile(null);
          closeModal()
        }
      }, [state]);
    
  return (
    <div className="fixed inset-0 z-20 flex items-start justify-center bg-[#293139a6] overflow-y-auto">
      <div className="my-auto w-[600px] rounded-xl bg-black p-8">
        <CloseRouter />

        <form className="flex flex-col gap-6 mt-2" ref={formRef} action={formAction}>
          {/* COVER & PROFILE  */}
          <div className="relative w-full">
            {/* COVER */}
            <div className="relative">
              {(!cover?.type.includes("image") || !previewCoverPicURL) && (
                <ImageIO
                  path={user.cover || "general/coverpic.jpg"}
                  alt="Cover"
                  w={600}
                  h={200}
                  tr
                />
              )}

              {cover?.type.includes("image") && previewCoverPicURL && (
                <NextImage
                  src={previewCoverPicURL}
                  alt=""
                  width={600}
                  height={200}
                />
              )}

              <input
                type="file"
                name="cover"
                onChange={handleCoverPicChange}
                className="hidden"
                id={"cover-pic"}
                accept="image/*"
              />
              <label htmlFor="cover-pic">
                <ImageIO
                  path="icons/image.svg"
                  alt=""
                  w={30}
                  h={30}
                  className="cursor-pointer absolute flex right-0 -translate-y-7"
                />
              </label>
            </div>

            {/* PROFILE */}
            <div className="absolute left-0 right-0 -translate-y-1/2 w-1/5 aspect-square rounded-full border-4 border-black bg-gray-300 overflow-hidden mx-auto">
              <div className="relative">

                {(!profile?.type.includes("image") || !previewProfilePicURL) && (
                <ImageIO
                  path={user.img || "icons/profile.svg"}
                  alt="Profile"
                  w={140}
                  h={140}
                  tr
                />
                )}

                {profile?.type.includes("image") && previewProfilePicURL && (
                <NextImage
                  src={previewProfilePicURL}
                  alt=""
                  width={140}
                  height={140}
                />
              )}

                <input
                type="file"
                name="img"
                onChange={handleProfilePicChange}
                className="hidden"
                id={"profile-pic"}
                accept="image/*"
              />
              <label htmlFor="profile-pic">
                <ImageIO
                  path="icons/image.svg"
                  alt=""
                  w={20}
                  h={20}
                  className="cursor-pointer absolute flex justify-center left-0 right-0 mx-auto -translate-y-20"
                />
                </label>
              </div>
            </div>
          </div>

          {/* INPUT */}
          <div className="flex flex-col gap-4 mt-20">
            {/* DISPLAY NAME & LOCATION */}
            <div className="flex gap-4">
              <input
                type="text"
                name="displayName"
                placeholder={user.displayName || "Full name"}
                className="flex-1 rounded-md border text-gray-950 border-gray-300 p-3 text-sm"
              />
              <input
                type="text"
                name="location"
                placeholder={user.location || "Location"}
                className="flex-1 rounded-md border text-gray-950 border-gray-300 p-3 text-sm"
              />
            </div>

            {/* BIO */}
            <textarea
              name="bio"
              placeholder={user.bio || "Bio"}
              className="w-full rounded-md border text-gray-950 border-gray-300 p-3 text-sm"
              rows={3}
            />

              {/* NEEDED FOR REVALIDATING ROUTE  */}
            <input
                type="text"
                name="username"
                value={user.username}
                hidden
                readOnly
            />

            {/* JOB & WEBSITE */}
            <div className="flex gap-4">
              <input
                type="text"
                name="job"
                placeholder={user.job || "Job"}
                className="flex-1 rounded-md border text-gray-950 border-gray-300 p-3 text-sm"
              />
              <input
                type="text"
                name="website"
                placeholder={user.website || "Website"}
                className="flex-1 rounded-md border text-gray-950 border-gray-300 p-3 text-sm"
              />
            </div>

            <div className="flex justify-end">
              <button className="bg-white text-black font-bold rounded-full py-2 px-4 disabled:cursor-not-allowed" disabled={isPending}>
                {isPending ? "Updating" :"Update"}
              </button>
            </div>
            {state.error && (
            <span className="text-red-300 p-4">Something went wrong!</span>
          )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateUserProfileClient