<template>
    <v-navigation-drawer
        v-model="visible"
        clipped
        app
        class="elevation-2"
    >
        <v-list dense>
            <template v-for="item in drawerItems">
                <v-list-item
                    :key="item.text"
                    link
                    @click="clickLeftDrawer(item.text)"
                >
                    <v-list-item-action>
                        <v-icon>{{ icons[item.icon] }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>
                            {{ item.text }}
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </template>
        </v-list>

        <!--Create New Tray-->
        <v-dialog v-model="dialogs.createNewDialog.status" width="800px">
            <v-card>
                <v-card-title>
                    Create New Course Tray
                </v-card-title>

                <v-container>
                    <v-row class="mx-2">
                        <v-col cols="12" md="12">
                            <v-card-subtitle>
                                Select your school
                            </v-card-subtitle>

                            <v-select
                                v-model="dialogs.createNewDialog.selection"
                                :items="presets"
                                :hint="`Last updated ${dialogs.createNewDialog.selection.date}`"
                                item-text="text"
                                label="Select"
                                solo
                                return-object
                                persistent-hint
                            ></v-select>

                            <v-card-subtitle>
                                Or optionally:
                            </v-card-subtitle>

                            <v-textarea
                                v-model="textareaValue"
                                solo
                                clearable
                                label="Paste your whole course tray here"
                            ></v-textarea>
                        </v-col>
                    </v-row>
                </v-container>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        text
                        color="primary"
                        @click="dialogs.createNewDialog.status = false"
                    >Cancel
                    </v-btn
                    >
                    <v-btn text @click="submitForm">Continue</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!--Save-->
        <v-dialog width="600px" v-model="dialogs.savingDialog.status">
            <v-card>
                <v-card-title>
                    <span class="headline">Save</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field
                                    v-model="dialogs.savingDialog.saveName"
                                    label="Name for save"
                                    :rules="[(v) =>v.length <= 50 || 'Name must be less than 30 characters',]"
                                    :counter="50"
                                    required
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="dialogs.savingDialog.status = false"
                    >Close
                    </v-btn
                    >
                    <v-btn color="blue darken-1" text @click="saveTray">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!--Saves-->
        <v-dialog v-model="dialogs.savesDialog.status" max-width="400">
            <!--Saves-->
            <v-card>
                <v-card-title class="headline">
                    Open a Saved Tray
                </v-card-title>
                <v-card class="ma-3">
                    <v-list class="mx-auto">
                        <v-list-item-group v-model="dialogs.savesDialog.selectionId">
                            <v-list-item
                                v-for="save in saves"
                                :key="save.id"
                                :value="save.id"
                                dense
                            >
                                <v-list-item-content>
                                    <v-list-item-title v-text="save.name"></v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                </v-card>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text color="error" @click="delSave">Delete</v-btn>
                    <v-btn text color="primary" @click="loadSave">Load</v-btn>

                </v-card-actions>
            </v-card>
        </v-dialog>

        <!--Help-->
        <v-dialog v-model="dialogs.helpDialog" width="800px">
            <v-card>
                <v-container>
                    <v-row class="mx-2">
                        <v-col cols="12" md="12">
                            <h2>Start:</h2>
                            <ol>
                                <li>Open the <strong>left</strong> navigation drawer from the top left burger menu icon.
                                </li>
                                <li>Click the <kbd>Create New Tray</kbd> button.</li>
                                <li>Select your school from the dropdown menu and click <kbd>continue</kbd>.</li>
                                <li>Open the <strong>right</strong> navigation drawer from right left burger icon.</li>
                                <li>You can start by clicking <kbd>None</kbd> and then selecting the courses you need
                                    to take this year. Blue = shown in the main tray, and Gray = hidden.
                                </li>
                                <v-img src="../assets/example1.png" max-height="180" contain aspect-ratio="1.0"></v-img>

                            </ol>
                            <h2>Selections:</h2>
                            <ul>
                                <li>
                                    <img class="customIcon" src="../assets/unavailable.png" alt="unavailable course">
                                    = Unavailable. The bar it is in has another selection.
                                </li>
                                <li>
                                    <img class="customIcon" src="../assets/available.png" alt="available course">
                                    = Available, can be selected.
                                </li>
                                <li>
                                    <img class="customIcon" src="../assets/selected.png" alt="selected course">
                                    = Selected
                                </li>
                                <li>
                                    <img class="customIcon" src="../assets/selected2.png" alt="selected2 course">
                                    = Selected elsewhere.
                                </li>
                                <li>
                                    <img class="customIcon" src="../assets/forced.png" alt="forced course">
                                    = Forced selection/Unavailable course selected. For multiple selections in same bar.
                                </li>
                            </ul>
                        </v-col>
                    </v-row>
                </v-container>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="dialogs.helpDialog = false">
                        Close
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!--Contact-->
        <v-dialog v-model="dialogs.contactDialog" max-width="700">
            <v-card>
                <v-card-title class="headline"> Feedback and contact</v-card-title>
                <v-card-text>
                    <p>
                        For feedback:<br/><a style="cursor: text;"
                    >feedback@lukiocoursecalc.com</a
                    >
                    </p>
                    <p>
                        And for contacting me: <br/><a style="cursor: text;"
                    >contact@lukiocoursecalc.com</a
                    >
                    </p>

                    <iframe
                        src="https://docs.google.com/forms/d/e/1FAIpQLSeKKfaBvzXIKVGoPlNysBfDolnpjxCbS4rVz7u1NLZqxzcYxA/viewform?embedded=true"
                        width="640"
                        height="590"
                    >Loading…
                    </iframe
                    >
                    <p>
                        Cant see the form? Click
                        <a
                            target="_blank"
                            href="https://docs.google.com/forms/d/e/1FAIpQLSeKKfaBvzXIKVGoPlNysBfDolnpjxCbS4rVz7u1NLZqxzcYxA/viewform?usp=sf_link"
                        >here</a
                        >
                    </p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="dialogs.contactDialog = false"
                    >Close
                    </v-btn
                    >
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-navigation-drawer>
</template>

<script>
import presetOptions from '../assets/presetOptions'
import {
    mdiPlusBoxOutline, mdiZipDisk, mdiFolderOpenOutline,
    mdiHelpCircleOutline, mdiCommentQuoteOutline, mdiDelete
} from '@mdi/js'


export default {
    name: 'LeftDrawer',
    props: ['show'],
    data() {
        return {
            icons: {
                mdiPlusBoxOutline,
                mdiZipDisk,
                mdiFolderOpenOutline,
                mdiHelpCircleOutline,
                mdiCommentQuoteOutline,
                mdiDelete,
            },
            textareaValue: '',
            visible: undefined,
            drawerItems: [
                {icon: 'mdiPlusBoxOutline', text: 'New Tray'},
                {icon: 'mdiZipDisk', text: 'Save'},
                {icon: 'mdiFolderOpenOutline', text: 'Open'},
                {icon: 'mdiHelpCircleOutline', text: 'Help'},
                {icon: 'mdiCommentQuoteOutline', text: 'Contact & feedback'},
            ],
            dialogs: {
                createNewDialog: {
                    status: false,
                    selection: {text: 'None', date: '🤷'},
                },
                contactDialog: false,
                helpDialog: false,
                savingDialog: {
                    status: false,
                    saveName: '',
                },
                savesDialog: {
                    status: false,
                    selectionId: '',
                },
            },
        }
    },
    methods: {
        clickLeftDrawer(button) {
            switch (button) {
                case 'New Tray':
                    this.dialogs.createNewDialog.status = true
                    break
                case 'Settings':
                    this.dialogs.settingsDialog = true
                    break
                case 'Help':
                    this.dialogs.helpDialog = true
                    break
                case 'Contact & feedback':
                    this.dialogs.contactDialog = true
                    break
                case 'Save':
                    this.dialogs.savingDialog.status = true
                    break
                case 'Open':
                    this.dialogs.savesDialog.status = true
                    break
            }
        },

        submitForm() {
            let presetName = this.dialogs.createNewDialog.selection.text
            this.dialogs.createNewDialog.status = false

            if (presetName !== 'None') {
                this.$store.dispatch('submitPreset', presetName)
            } else if (this.textareaValue) {
                this.$store.dispatch('submitText', this.textareaValue)
            }
        },

        loadSave() {
            let selection = this.dialogs.savesDialog.selectionId
            if (selection) {
                this.dialogs.savesDialog.status = false
                this.$store.dispatch('loadSavedTray', selection)
            }
        },

        saveTray() {
            let saveName = this.dialogs.savingDialog.saveName
            if (saveName.length <= 50) {
                this.dialogs.savingDialog.status = false
                this.$store.dispatch('saveTrayByName', saveName)
            }
        },

        delSave() {
            this.$store.dispatch('delSaveById', this.dialogs.savesDialog.selectionId)
        },
    },
    computed: {
        saves() {
            return this.$store.getters.saved
        },
        presets() {
            return presetOptions
        },
    },
    watch: {
        show() {
            this.visible = this.show
        },
        visible() {
            this.$emit('update:rightLeftShow', this.visible)
        },
    },
}
</script>

<style scoped>

.customIcon {
    width: auto;
    height: 1.5em;
    vertical-align: middle;
    margin: 3px;
}

</style>
