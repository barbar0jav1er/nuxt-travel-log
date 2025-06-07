<script setup lang="ts">
import { CENTER_USA } from "~/lib/constants";

const colorMode = useColorMode();
const mapStore = useMapStore();

const style = computed(() => colorMode.value === "dark"
  ? "/styles/dark.json"
  : "https://tiles.openfreemap.org/styles/liberty");
const center = CENTER_USA;
const zoom = 3;

onMounted(() => {
  mapStore.init();
});
</script>

<template>
  <MglMap
    :map-style="style"
    :center="center"
    :zoom="zoom"
  >
    <MglNavigationControl />
    <MglMarker
      v-for="point in mapStore.mapPoints"
      :key="point.id"
      :coordinates="[point.long, point.lat]"
    >
      <template #marker>
        <div class="tooltip" :data-tip="point.label">
          <Icon
            name="tabler:map-pin-filled"
            size="32"
            class="text-secondary"
          />
          <div />
        </div>
      </template>
    </MglMarker>
  </MglMap>
</template>
