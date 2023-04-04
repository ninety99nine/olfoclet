<template>

    <div>

        <NoScreens v-if="useVersionBuilder.hasDownloadedBuilder == false || useVersionBuilder.hasSavedBuilder == false" class="p-8"></NoScreens>

        <div v-else class="grid grid-cols-3">

            <div class="grid-span-1 py-8 px-4">
                <SimulatorLogs :logs="(response || {}).logs" :showLogs="useVersionBuilder.builder.simulator.debugger.return_logs" origin="simulator"></SimulatorLogs>
            </div>

            <div class="grid-span-1">
                <div class="flex justify-center pt-8">
                    <Nexus5 class="scale-75 origin-top">
                        <MobileScreen @response="response = $event"></MobileScreen>
                    </Nexus5>
                </div>
            </div>

            <div class="grid-span-1">

            </div>

        </div>

    </div>

</template>

<script>

    import SimulatorLogs from "./Logs";
    import MobileScreen from "./MobileScreen";
    import Nexus5 from "@components/MobileDevice/Nexus5";
    import NoScreens from './../Editor/ScreenEditor/NoScreens';
    import { useVersionBuilder } from '@stores/VersionBuilder';

    export default {
        components: { SimulatorLogs, MobileScreen, Nexus5, NoScreens },
        data() {
            return {
                useVersionBuilder: useVersionBuilder(),
                response: null
            }
        }
    };

</script>
