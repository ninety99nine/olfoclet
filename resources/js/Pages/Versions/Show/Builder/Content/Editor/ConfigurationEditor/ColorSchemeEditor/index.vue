<template>

    <div class="grid grid-cols-3 gap-x-8 gap-y-4">

        <!--
            File 02 — appearance now lives in settings.appearance.color_scheme
            (builder-UI only). Reads/writes go through settings so the builder JSON
            stays pure service-definition.
        -->
        <div v-for="(event_color, event_name) in eventColors" :key="event_name"
             class="col-span-1 flex items-center justify-between p-2 pl-4 rounded-md cursor-pointer transition-all duration-300"
             @mouseenter="addHover(event_name)" @mouseleave="removeHover(event_name)"
             :style="style(event_name, event_color)"
             @click="openColorPicker(event_name, $event)">

            <!-- Name -->
            <span class="text-xs mr-4">{{ event_name }}</span>

            <!-- Color Picker -->
            <DefaultColorPicker :ref="event_name" v-model="eventColors[event_name]"></DefaultColorPicker>

        </div>

    </div>

</template>

<script>

    import { useVersionBuilder } from '@stores/VersionBuilder';
    import DefaultColorPicker from '@components/ColorPicker/DefaultColorPicker';

    export default {
        components: { DefaultColorPicker },
        data(){
            return {
                namesHovered: [],
                useVersionBuilder: useVersionBuilder()
            }
        },
        computed: {
            //  File 02 — the live event_colors map from settings.appearance
            //  (empty when a version has no colour scheme, so nothing renders).
            eventColors(){
                const cs = ((this.useVersionBuilder.settings || {}).appearance || {}).color_scheme;
                return (cs && cs.event_colors) ? cs.event_colors : {};
            }
        },
        methods: {
            addHover(name){
                this.namesHovered.push(name);
            },
            removeHover(name){
                this.namesHovered.splice(this.namesHovered.indexOf(name), 1);
            },
            isHovering(name){
                return this.namesHovered.includes(name);
            },
            style(name, color){
                return {
                    border: '1px solid ' + this.color(name, color, 50),
                    backgroundColor: this.color(name, color, 10),
                }
            },
            color(name, color, opacity){
                return this.isHovering(name) ? color+opacity : 'transparent';
            },
            openColorPicker(event_name, e){
                this.$refs[event_name][0].$refs.colorPicker.handleTrigger();
            }
        }
    };

</script>
