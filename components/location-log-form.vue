<script setup lang="ts">
import { CENTER_USA } from "~/lib/constants";
import { InsertLocationLog } from "~/lib/db/schema";

const props = defineProps<{
  submitLabel: string;
  submitIcon: string;
  initialValues?: InsertLocationLog;
  onSubmitComplete: () => void;
  onSubmit: (location: InsertLocationLog) => Promise<any>;
}>();
const initialValues = {
  name: "",
  description: "",
  startedAt: Date.now() - 24 * 60 * 60 * 1000,
  endedAt: Date.now(),
  long: (CENTER_USA as [number, number])[0],
  lat: (CENTER_USA as [number, number])[1],
};
</script>

<template>
  <LocationBaseForm
    v-slot="{ errors, loading }"
    :zoom="11"
    :schema="InsertLocationLog"
    :initial-values="props.initialValues || initialValues "
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
    <AppDateFormField
      name="startedAt"
      :value="initialValues.startedAt"
      :error="errors.startedAt"
      label="Started At"
      :disabled="loading"
    />
    <AppDateFormField
      name="endedAt"
      :value="initialValues.endedAt"
      :error="errors.endedAt"
      label="Ended At"
      :disabled="loading"
    />
  </LocationBaseForm>
</template>
