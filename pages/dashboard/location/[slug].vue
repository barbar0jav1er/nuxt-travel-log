<script setup lang="ts">
import type { FetchError } from "ofetch";

const locationStore = useLocationStore();
const route = useRoute();
const isOpen = ref(false);
const {
  currentLocation: location,
  currentLocationStatus: status,
  currentLocationError: error,
} = storeToRefs(locationStore);

const deleteError = ref("");
const isDeleting = ref(false);

const loading = computed(() => status.value === "pending" || isDeleting.value);
const errorMessage = computed(() => error.value?.statusMessage || deleteError.value);

onMounted(() => {
  locationStore.refreshCurrentLocation();
});

function openDialog() {
  isOpen.value = true;
  (document.activeElement as HTMLAnchorElement).blur();
}

async function confirmedDelete() {
  try {
    isOpen.value = false;
    deleteError.value = "";
    isDeleting.value = true;
    await $fetch(`/api/locations/${route.params.slug}`, {
      method: "DELETE",
    });
    navigateTo("/dashboard");
  }
  catch (e) {
    const error = e as FetchError;
    deleteError.value = getFetchErrorMessage(error);
  }
  isDeleting.value = false;
}

onBeforeRouteUpdate((to) => {
  if (to.name === "dashboard-location-slug") {
    locationStore.refreshCurrentLocation();
  }
});
</script>

<template>
  <div class="p-4 min-h-64">
    <div v-if="loading">
      <div class="loading loading-lg" />
    </div>

    <div v-if="errorMessage && !loading" class="alert alert-error">
      <h2 class="text-lg">
        {{ errorMessage }}
      </h2>
    </div>
    <div v-if="route.name === 'dashboard-location-slug' && location && !loading">
      <h2 class="text-xl">
        {{ location?.name }}
        <div class="dropdown dropdown-start">
          <div
            tabindex="0"
            role="button"
            class="btn m-1 btn-sm p-0"
          >
            <Icon name="tabler:dots-vertical" size="20" />
          </div>
          <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
            <li>
              <NuxtLink @click="openDialog">
                <Icon name="tabler:trash-x-filled" size="20" />
                Delete
              </NuxtLink>
            </li>

            <li>
              <NuxtLink
                :to="{ name: 'dashboard-location-slug-edit', params: { slug: route.params.slug } }"
              >
                <Icon name="tabler:map-pin-cog" size="20" />
                Edit
              </NuxtLink>
            </li>
          </ul>
        </div>
      </h2>
      <p class="text-sm">
        {{ location.description }}
      </p>
      <div v-if="!location.locationLogs.length" class="text-lg mt-4">
        <p class="text-sm italic">
          Add a location log to get started.
        </p>
        <button class="btn btn-primary mt-2">
          Add Location Log
          <Icon name="tabler:map-pin-plus" />
        </button>
      </div>
    </div>
    <div v-if="route.name !== 'dashboard-location-slug'">
      <NuxtPage />
    </div>
    <AppDialog
      :is-open="isOpen"
      title="Are you sure?"
      description="Deleting this location will also delete all of the associated logs. This cannot be undone. Do you really want to do this?"
      confirm-label="Yes, delete this location"
      confirm-class="btn-error"
      @on-close="isOpen = false;"
      @on-confirmed="confirmedDelete"
    />
  </div>
</template>
