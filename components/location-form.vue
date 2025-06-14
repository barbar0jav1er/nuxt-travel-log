<script setup lang="ts">
import type { FetchError } from "ofetch";

import { toTypedSchema } from "@vee-validate/zod";
import { AppPlaceSearch } from "#components";

import type { NominatimResult } from "~/lib/types";

import { CENTER_USA } from "~/lib/constants";
import { InsertLocation } from "~/lib/db/schema";

const props = defineProps<{
  submitLabel: string;
  submitIcon: string;
  onSubmitComplete: () => void;
  initialValues?: InsertLocation | null;
  onSubmit: (location: InsertLocation) => Promise<any>;
}>();

const submitError = ref("");
const loading = ref(false);
const submitted = ref(false);

const router = useRouter();

const mapStore = useMapStore();

const { handleSubmit, errors, meta, setErrors, setFieldValue, controlledValues } = useForm({
  validationSchema: toTypedSchema(InsertLocation),
  initialValues: {
    name: props.initialValues?.name || "",
    description: props.initialValues?.description || "",
    long: props.initialValues?.long || (CENTER_USA as [number, number])[0],
    lat: props.initialValues?.lat || (CENTER_USA as [number, number])[1],
  },
});

const onSubmit = handleSubmit(async (values: InsertLocation) => {
  try {
    submitError.value = "";
    loading.value = true;
    await props.onSubmit(values);
    submitted.value = true;
    props.onSubmitComplete();
  }
  catch (e) {
    const error = e as FetchError;
    if (error.data.data) {
      setErrors(error.data?.data);
    }
    submitError.value = getFetchErrorMessage(error);
  }
  loading.value = false;
});

function formatNumber(value?: number) {
  if (!value)
    return 0;
  return value.toFixed(5);
}

function searchResultSelected(result: NominatimResult) {
  setFieldValue("name", result.display_name);

  mapStore.addedPoint = {
    long: Number(result.lon),
    lat: Number(result.lat),
    description: "",
    name: "Added Point",
    id: 1,
    centerMap: true,
  };
}

effect(() => {
  if (mapStore.addedPoint) {
    setFieldValue("lat", mapStore.addedPoint.lat);
    setFieldValue("long", mapStore.addedPoint.long);
  }
});

onMounted(() => {
  mapStore.addedPoint = {
    long: props.initialValues?.long || (CENTER_USA as [number, number])[0],
    lat: props.initialValues?.lat || (CENTER_USA as [number, number])[1],
    description: "",
    name: "Added Point",
    id: 1,
  };
});

onBeforeRouteLeave(() => {
  if (meta.value.dirty && !submitted.value) {
  // eslint-disable-next-line no-alert
    const confirm = window.confirm("Are you sure you eant to leave? All unsaved changes will be lose");
    if (!confirm)
      return false;
  }

  mapStore.addedPoint = null;
  return true;
});
</script>

<template>
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
    <p class="text-xs text-gray-400">
      Current coordinates: {{ formatNumber(controlledValues.lat) }}, {{ formatNumber (controlledValues.long) }}
    </p>
    <p>To set the coordinates:</p>
    <ul class="list-disc ml-4 text-sm">
      <li>
        Drag the <Icon name="tabler:map-pin-filled" class="text-warning" /> marker on the map.
      </li>
      <li>Double click on the map</li>
      <li>Search for a location bellow.</li>
    </ul>

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
        {{ props.submitLabel }}
        <span v-if="loading" class="loading loading-spinner loading-sm" />
        <Icon
          v-else
          :name="submitIcon"
          size="24"
        />
      </button>
    </div>
  </form>
  <div class="divider" />
  <AppPlaceSearch @result-selected="searchResultSelected" />
</template>
