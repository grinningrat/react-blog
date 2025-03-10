import React from "react";
import Head from 'next/head'
import { getBuild, getBuilds } from "utils/payloadApi";
import { BuildPage } from "components"
    
export default function Build({ targetBuild }) {
  return (
    <div>
      <Head>
        <title>{targetBuild.metaTitle}</title>
        <meta name="description" content={targetBuild.metaDescription} />
        <meta property="og:title" content={targetBuild.metaTitle} />
        <meta property="og:description" content={targetBuild.metaDescription} />
        <meta property="og:url" content={`https://diredice.com/builds/${targetBuild.slug}`} />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BuildPage build={targetBuild} />
    </div>
  )
}

export async function getStaticProps({ params = {} } = {}) {
  const targetBuild = (await getBuild(params.buildSlug));
  return {
    props: {
      targetBuild,
    }
  }
}

export async function getStaticPaths() {
  const builds = (await getBuilds());
  const paths = builds.map((build, index) => {
    return {
      params: {
        buildSlug: build.slug,
      }
    };
  });
  return {
    paths,
    fallback: false,
  };
}