<template>
    <v-app>
        <right-drawer
            :show="drawerRight"
            v-on:update:rightDrawerShow="drawerRight = $event"
        ></right-drawer>

        <left-drawer
            :show="drawerLeft"
            v-on:update:rightLeftShow="drawerLeft = $event"
        >
        </left-drawer>

        <v-app-bar clipped-left clipped-right app color="blue darken-3" dark>
            <v-app-bar-nav-icon
                @click.stop="drawerLeft = !drawerLeft"
            ></v-app-bar-nav-icon>

            <v-toolbar-title style="width: 300px;" class="ml-0 pl-4">
                <span class="hidden-sm-and-down">CourseCalc</span>
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-switch v-model="isDark" hide-details color="info"></v-switch>
            <span>&#8592;</span>
            <v-icon class="mr-8">{{ mdiLightbulbOutline }}</v-icon>

            <v-app-bar-nav-icon
                @click.stop="drawerRight = !drawerRight"
            ></v-app-bar-nav-icon>
        </v-app-bar>

        <v-main>
            <v-container fluid>
                <v-row align="center" justify="center">
                    <v-col :cols="$vuetify.breakpoint.mdAndDown ? 12 : 11">
                        <v-expansion-panels multiple v-model="panels">
                            <v-expansion-panel
                                v-for="(term, index) in terms"
                                :key="'term' + index.toString()"
                                :class="`elevation-3`"
                            >
                                <v-expansion-panel-header>
                                    <strong>{{ term.header }}</strong>
                                </v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <block
                                        v-for="(block, index) in term.data"
                                        :key="'term' + index"
                                        :block_title="1 + parseInt(index)"
                                        :courses="block.data"
                                    >
                                    </block>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>

        <v-footer padless>
            <v-col class="text-center text-sm-caption" cols="12">
                © {{ new Date().getFullYear() }} — LukioCourseCalc
            </v-col>
        </v-footer>
    </v-app>
</template>

<script>
import RightDrawer from './components/RightDrawer';
import LeftDrawer from './components/LeftDrawer';
import Block from './components/Block';
import { mdiLightbulbOutline } from '@mdi/js';

export default {
    components: { Block, LeftDrawer, RightDrawer },
    created() {
        this.textareaValue = JSON.parse(localStorage.getItem('textareaValue'));
        this.isDark = JSON.parse(localStorage.getItem('isDark'));
    },
    data: () => ({
        drawerLeft: undefined,
        drawerRight: undefined,

        mdiLightbulbOutline,

        isDark: false,
        panels: [0, 1, 2, 3, 4],
    }),
    computed: {
        terms() {
            return this.$store.getters.open.trayData;
        },
    },
    watch: {
        isDark() {
            this.$vuetify.theme.dark = this.isDark;
            localStorage.setItem('isDark', JSON.stringify(this.isDark));
        },
    },
};
</script>

<style></style>
