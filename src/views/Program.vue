<template>
  <MainLayout :pageTitle="$store.state.conferenceName">
    <PresentationBlocks :blocks="$store.state.blocks" />
  </MainLayout>
</template>
