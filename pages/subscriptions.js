import Head from "next/head";
import { getVideos } from "lib/data.js";
import prisma from "lib/prisma";
import Videos from "components/Videos";
import Heading from "components/Heading";
import LoadMore from "components/LoadMore";
import { useState } from "react";
import { amount } from "lib/config";
import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Subscriptions({ initialVideos }) {
  const [videos, setVideos] = useState(initialVideos);
  const [reachedEnd, setReachedEnd] = useState(initialVideos.length < amount);
  const { data: session, status } = useSession();
  const router = useRouter();

  const loading = status === "loading";

  if (loading) {
    return null;
  }

  if (session && !session.user.name) {
    router.push("/setup");
  }

  return (
    <div>
      <Head>
        <title></title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Heading />

      {videos.length === 0 && (
        <p className="flex justify-center mt-20">No videos found!</p>
      )}

      <Videos videos={videos} />
      {!reachedEnd && (
        <LoadMore
          videos={videos}
          setVideos={setVideos}
          setReachedEnd={setReachedEnd}
          subscriptions={session.user.id}
        />
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  let videos = await getVideos({ subscriptions: session.user.id }, prisma);
  videos = JSON.parse(JSON.stringify(videos));

  return {
    props: {
      initialVideos: videos,
    },
  };
}
