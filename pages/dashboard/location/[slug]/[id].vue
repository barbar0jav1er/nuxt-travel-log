<script setup lang="ts">
const route = useRoute();
const locationStore = useLocationStore();
const {
  currentLocationLog: locationLog,
  currentLocationLogStatus: status,
  currentLocationLogError: error,
} = storeToRefs(locationStore);

const loading = computed(() => status.value === "pending");
const errorMessage = computed(() => error.value);

onMounted(() => {
  locationStore.refreshCurrentLocationLog();
});
</script>

<template>
  <div>
    <div v-if="loading">
      <div class="loading loading-lg" />
    </div>

    <div v-if="errorMessage && !loading" class="alert alert-error">
      <h2 class="text-lg">
        {{ errorMessage }}
      </h2>
    </div>
    <div v-if="route.name === 'dashboard-location-slug-id' && locationLog && !loading">
      <p class="text-sm italic text-gray-500">
        <span v-if="locationLog.startedAt !== locationLog.endedAt">
          {{ formatDate(locationLog.startedAt) }} / {{ formatDate(locationLog.endedAt) }}
        </span>
        <span v-else>
          {{ formatDate(locationLog.startedAt) }}
        </span>
      </p>
      <h2 class="text-xl">
        {{ locationLog?.name }}
        <div class="dropdown dropdown-start">
          <div
            tabindex="0"
            role="button"
            class="btn m-1 btn-sm p-0"
          >
            <Icon name="tabler:dots-vertical" size="20" />
          </div>
        </div>
      </h2>

      <p class="text-sm">
        {{ locationLog.description }}
      </p>
    </div>
  </div>
</template>
