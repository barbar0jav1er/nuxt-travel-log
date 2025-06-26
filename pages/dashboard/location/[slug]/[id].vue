<script setup lang="ts">
import type { FetchError } from "ofetch";

const route = useRoute();
const locationStore = useLocationStore();
const {
  currentLocationLog: locationLog,
  currentLocationLogStatus: status,
  currentLocationLogError: error,
} = storeToRefs(locationStore);

const isOpen = ref(false);
const deleteError = ref("");
const isDeleting = ref(false);

const loading = computed(() => status.value === "pending" || isDeleting.value);
const errorMessage = computed(() => error.value?.statusMessage || deleteError.value);

onMounted(() => {
  locationStore.refreshCurrentLocationLog();
});

onBeforeRouteUpdate((to) => {
  if (to.name === "dashboard-location-slug-id") {
    locationStore.refreshCurrentLocationLog();
  }
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
    await $fetch(`/api/locations/${route.params.slug}/${route.params.id}`, {
      method: "DELETE",
    });
    navigateTo({
      name: "dashboard-location-slug",
      params: {
        slug: route.params.slug,
      },
    });
  }
  catch (e) {
    const error = e as FetchError;
    deleteError.value = getFetchErrorMessage(error);
  }
  isDeleting.value = false;
}
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
          <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
            <li>
              <NuxtLink @click="openDialog">
                <Icon name="tabler:trash-x-filled" size="20" />
                Delete
              </NuxtLink>
            </li>

            <li>
              <NuxtLink
                :to="{ name: 'dashboard-location-slug-id-edit', params: { slug: route.params.slug, id: route.params.id } }"
              >
                <Icon name="tabler:map-pin-cog" size="20" />
                Edit
              </NuxtLink>
            </li>
          </ul>
        </div>
      </h2>

      <p class="text-sm">
        {{ locationLog.description }}
      </p>
    </div>
    <div v-else>
      <NuxtPage />
    </div>
    <AppDialog
      :is-open="isOpen"
      title="Are you sure?"
      description="Deleting this location log cannot be undone. Do you really want to do this?"
      confirm-label="Yes, delete this location log!"
      confirm-class="btn-error"
      @on-close="isOpen = false;"
      @on-confirmed="confirmedDelete"
    />
  </div>
</template>
