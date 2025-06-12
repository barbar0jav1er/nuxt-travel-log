<script setup lang="ts">
import type { InsertLocation } from "~/lib/db/schema";

const locationStore = useLocationStore();

const { $csrfFetch } = useNuxtApp();
const submitError = ref("");
const loading = ref(false);
const submitted = ref(false);
const submitErrors = ref<Record<string, string>>({});

async function onSubmit(values: InsertLocation) {
  console.log(values);

//   try {
//     submitError.value = "";
//     submitErrors.value = {};
//     loading.value = true;
//     await $csrfFetch("/api/locations", {
//       method: "post",
//       body: values,
//     });
//     submitted.value = true;
//     navigateTo("/dashboard");
//   }
//   catch (e) {
//     const error = e as FetchError;
//     if (error.data.data) {
//       submitError.value = error.data?.data;
//     }
//     submitError.value = getFetchErrorMessage(error);
//   }
//   loading.value = false;
}
</script>

<template>
  <LocationForm
    :submitted
    :loading
    :on-submit
    :submit-errors
    :initial-values="locationStore.currentLocation"
  />
</template>
