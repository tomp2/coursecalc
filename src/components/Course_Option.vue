<template>
    <a type="button"
       :class="['c mb-2', selectionStatus, this.$vuetify.theme.dark ? 'dark' : '']"
       @click="select">
        {{ course }}
    </a>
</template>

<script>
export default {
    name: 'courseOption',
    props: ['course'],
    computed: {
        courseValues () {
            return this.$store.getters.courses[this.course]
        },

        selectionStatus () {
            if (this.courseValues.s) {
                return 'c_selected'
            } else if (this.courseValues.v) {
                return 'c_available'
            } else {
                return 'c_inactive'
            }
        },
    },
    methods: {
        select () {
            if (!this.courseValues.s) {
                let payload = {
                    shortName: this.course,
                    value: !this.courseValues.v,
                }
                this.$store.dispatch('setCourseVisibility', payload)
            }
        },
    },
}
</script>

<style>

</style>
