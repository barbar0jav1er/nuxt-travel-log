<script setup lang="ts">
import type { MapPoint } from "~/lib/types";

defineProps<{
  mapPoint: MapPoint;
}>();
const mapStore = useMapStore();
</script>

<template>
  <NuxtLink
    :to="mapPoint.to "
    class="card card-compact bg-base-300 h-40 w-72 shrink-0 hover:cursor-pointer border-2 mb-4"
    :class="{
      'border-accent': isPointSelected(mapPoint, mapStore.selectedPoint),
      'border-transparent': !isPointSelected(mapPoint, mapStore.selectedPoint),
    }"
    @mouseenter="mapStore.selectedPoint = mapPoint"
    @mouseleave="mapStore.selectedPoint = null"
  >
    <div class="card-body">
      <slot name="top" />
      <h3 class="text-xl">
        {{ mapPoint.name }}
      </h3>
      <p>{{ mapPoint.description }}</p>
    </div>
  </NuxtLink>
</template>
