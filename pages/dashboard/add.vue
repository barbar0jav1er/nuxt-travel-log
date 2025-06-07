<script setup lang="ts">
import type { FetchError } from "ofetch";

import { toTypedSchema } from "@vee-validate/zod";

import { InsertLocation } from "~/lib/db/schema";

const router = useRouter();
const submitError = ref("");
const loading = ref(false);
const submitted = ref(false);
const { $csrfFetch } = useNuxtApp();
const { handleSubmit, errors, meta, setErrors } = useForm({
  validationSchema: toTypedSchema(InsertLocation),
});

const onSubmit = handleSubmit(async (values) => {
  try {
    submitError.value = "";
    loading.value = true;
    await $csrfFetch("/api/locations", {
      method: "post",
      body: values,
    });
    submitted.value = true;
    navigateTo("/dashboard");
  }
  catch (e) {
    const error = e as FetchError;
    if (error.data.data) {
      setErrors(error.data?.data);
    }
    submitError.value = error.data?.statusMessage || error.statusMessage || "An unknown error occurred";
  }
  loading.value = false;
});

onBeforeRouteLeave(() => {
  if (meta.value.dirty && !submitted.value) {
  // eslint-disable-next-line no-alert
    const confirm = window.confirm("Are you sure you eant to leave? All unsaved changes will be lose");
    if (!confirm)
      return false;
  }

  return true;
});
</script>

<template>
  <div class="container max-w-md m-auto ">
    <div class="my-4">
      <h1 class="text-lg">
        Add Location
      </h1>
      <p class="text-sm">
        A location is a place you have visited or will travel to. It can be a city, country, state or point of interest. You can add specific times you visited this location after adding.
      </p>
    </div>
    <div
      v-if="submitError"
      role="alert"
      class="alert alert-error"
    >
      <span>{{ submitError }}</span>
    </div>
    <form class="flex flex-col gap-2" @submit.prevent="onSubmit">
      <AppFormField
        name="name"
        :error="errors.name"
        label="Name"
        :disabled="loading"
      />
      <AppFormField
        name="description"
        type="textarea"
        :error="errors.description"
        label="Description"
        :disabled="loading"
      />
      <AppFormField
        name="lat"
        type="number"
        :error="errors.lat"
        label="Latitude"
        :disabled="loading"
      />
      <AppFormField
        name="long"
        :error="errors.long"
        type="number"
        label="Longitude"
        :disabled="loading"
      />
      <div class="flex justify-end gap-2">
        <button
          :disabled="loading"
          class="btn btn-outline"
          type="button"
          @click="router.back()"
        >
          <Icon name="tabler:arrow-left" size="24" />
          Cancel
        </button>
        <button
          :disabled="loading"
          class="btn btn-primary"
          type="submit"
        >
          Add
          <span v-if="loading" class="loading loading-spinner loading-sm" />
          <Icon
            v-else
            name="tabler:circle-plus-filled"
            size="24"
          />
        </button>
      </div>
    </form>
  </div>
</template>
