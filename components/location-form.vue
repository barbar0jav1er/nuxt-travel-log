<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { AppPlaceSearch } from "#components";

import type { NominatimResult } from "~/lib/types";

import { CENTER_USA } from "~/lib/constants";
import { InsertLocation } from "~/lib/db/schema";

const props = defineProps<{
  initialValues?: InsertLocation | null;
  onSubmit: (location: InsertLocation) => Promise<any>;
  loading: boolean;
  submitted: boolean;
  submitErrors: Record<string, string>;
}>();

const router = useRouter();

const mapStore = useMapStore();

const { handleSubmit, errors, meta, setErrors, setFieldValue, controlledValues } = useForm({
  validationSchema: toTypedSchema(InsertLocation),
  initialValues: {
    name: props.initialValues?.name || "",
    description: props.initialValues?.name || "",
    long: props.initialValues?.long || (CENTER_USA as [number, number])[0],
    lat: props.initialValues?.lat || (CENTER_USA as [number, number])[1],
  },
});

const onSubmit = handleSubmit(props.onSubmit);

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
  setErrors(props.submitErrors);
});

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
  if (meta.value.dirty && !props.submitted) {
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
  <div class="divider" />
  <AppPlaceSearch @result-selected="searchResultSelected" />
</template>
