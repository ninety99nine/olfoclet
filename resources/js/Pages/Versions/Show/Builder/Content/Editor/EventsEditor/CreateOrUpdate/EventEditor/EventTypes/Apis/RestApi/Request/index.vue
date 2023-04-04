<template>

    <div>

        <DefaultSelect v-model="form.event_data.method" :options="methodOptions" label="Method" class="mb-6"></DefaultSelect>

        <TextOrCodeEditor v-model="form.event_data.url" label="Url" placeholder="http://example.com/api" :error="form.errors.url" :showCode="true" class="mb-6"></TextOrCodeEditor>

        <div class="grid grid-cols-2 gap-4 items-center">

            <div class="col-span-1">

                <DefaultSwitch v-model="form.event_data.cache.enabled" label="Cache" :note="form.event_data.cache.enabled ? 'Disable caching' : 'Enable caching'"></DefaultSwitch>

            </div>

            <div v-if="form.event_data.cache.enabled" class="col-span-1">

                <DefaultInput v-model="form.event_data.cache.name" label="Cache name" info="Cache data on a universal name accesible by any subscriber e.g news; or cache data on a unique name accessible by a specific subscriber e.g {{ ussd.account.id }}_profile" :error="form.errors.cache_name"></DefaultInput>

            </div>

            <div v-if="form.event_data.cache.enabled" class="col-span-2 flex mb-6">

                <DefaultInput v-model="form.event_data.cache.duration.number" type="number" :error="form.errors.cache_duration_number"  class="mr-4"></DefaultInput>

                <DefaultSelect v-model="form.event_data.cache.duration.type" :options="cacheOptions" :error="form.errors.cache_duration_type" class="w-40"></DefaultSelect>

            </div>

        </div>

    </div>

</template>

<script>

    import DefaultInput from "@components/Input/DefaultInput";
    import DefaultSelect from "@components/Select/DefaultSelect";
    import DefaultSwitch from "@components/Switch/DefaultSwitch.vue";
    import TextOrCodeEditor from '@components/TextOrCodeEditor/TextOrCodeEditor';

    export default {
        props: ['form'],
        components: { DefaultInput, DefaultSelect, DefaultSwitch, TextOrCodeEditor },
        data(){
            return {
                methodOptions: [
                    {
                        label: 'GET',
                        value: 'get'
                    },
                    {
                        label: 'POST',
                        value: 'post'
                    },
                    {
                        label: 'PUT',
                        value: 'put'
                    },
                    {
                        label: 'PATCH',
                        value: 'patch'
                    },
                    {
                        label: 'DELETE',
                        value: 'delete'
                    }
                ]
            }
        },
        computed: {
            cacheOptions() {
                return [
                    {
                        label: this.form.event_data.cache.duration.number == 1 ? 'Minute' : 'Minutes',
                        value: 'minutes',
                    },
                    {
                        label: this.form.event_data.cache.duration.number == 1 ? 'Hour' : 'Hours',
                        value: 'hours',
                    },
                    {
                        label: this.form.event_data.cache.duration.number == 1 ? 'Day' : 'Days',
                        value: 'days',
                    },
                    {
                        label: this.form.event_data.cache.duration.number == 1 ? 'Week' : 'Weeks',
                        value: 'weeks',
                    },
                    {
                        label: this.form.event_data.cache.duration.number == 1 ? 'Month' : 'Months',
                        value: 'months',
                    },
                    {
                        label: this.form.event_data.cache.duration.number == 1 ? 'Year' : 'Years',
                        value: 'years',
                    }
                ];
            }
        }
    }
</script>
