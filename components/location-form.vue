<script setup lang="ts">
import { CENTER_USA } from "~/lib/constants";
import { InsertLocation } from "~/lib/db/schema";

const props = defineProps<{
  submitLabel: string;
  submitIcon: string;
  onSubmitComplete: () => void;
  onSubmit: (location: InsertLocation) => Promise<any>;
  initialValues?: InsertLocation;
  zoom?: number;
}>();
</script>

<template>
  <LocationBaseForm
    v-slot="{ errors, loading }"
    :zoom="props.zoom || 6"
    :schema="InsertLocation"
    :initial-values="props.initialValues || {
      name: '',
      description: '',
      long: (CENTER_USA as [number, number])[0],
      lat: (CENTER_USA as [number, number])[1],
    }"
    :on-submit
    :on-submit-complete
    :submit-label
    :submit-icon
  >
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
  </LocationBaseForm>
</template>
