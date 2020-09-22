<template>
    <v-navigation-drawer
        v-model="visible"
        :mobile-breakpoint="600"
        app
        clipped
        right
        class="elevation-2 scroll-visible"
        :width="$vuetify.breakpoint.width >= 900 ? 300 : 210"
    >
        <v-container class="fill-height align-start" fluid>
            <v-row align="center" justify="center">
                <v-btn
                    class="ma-2"
                    outlined
                    color="success"
                    @click="selectAll"
                    :loading="loading"
                >
                    All
                </v-btn>
                <v-btn
                    class="ma-2"
                    outlined
                    color="error"
                    @click="deSelectAll"
                    :loading="loading"
                >
                    None
                </v-btn>

                <v-container
                    v-for="(values, key, index) in subjectList"
                    :key="index.toString() + $store.state.keyp + values"
                    :class="dim(index)"
                >
                    <course-option
                        v-for="(course, index) in values"
                        :key="index.toString() + course + $store.state.keyp"
                        :course="course"
                    ></course-option>
                </v-container>
            </v-row>
        </v-container>
    </v-navigation-drawer>
</template>

<script>
import CourseOption from './Course_Option';

export default {
    name: 'RightDrawer',
    components: { CourseOption },
    props: ['show'],
    data: () => ({
        loading: false,
        visible: undefined,
    }),
    methods: {
        selectAll() {
            this.loading = true;
            this.$store.dispatch('setCourseVisibilityAll', true).then(() => {
                this.loading = false;
            });
        },
        deSelectAll() {
            this.loading = true;
            this.$store.dispatch('setCourseVisibilityAll', false).then(() => {
                this.loading = false;
            });
        },
        dim: function (int) {
            if (int % 2 === 0) {
                return 'px-2 py-1 ma-1 elevation-1 rounded even';
            } else {
                return 'px-2 py-1 ma-1 elevation-1 rounded odd';
            }
        },
    },
    computed: {
        allCourses() {
            return this.$store.getters.courses;
        },
        subjectList() {
            let courses = [...Object.keys(this.allCourses)].sort();
            let MATCH = RegExp('[A-ZÄÖ ]+', 'g');
            let data = {};
            for (const course of courses) {
                let subject = course.match(MATCH)[0];
                if (data[subject]) {
                    data[subject].push(course);
                } else if (subject.length > 0) {
                    data[subject] = [course];
                }
            }
            return data;
        },
    },
    watch: {
        show() {
            this.visible = this.show;
        },
        visible() {
            this.$emit('update:rightDrawerShow', this.visible);
        },
    },
};
</script>

<style scoped>
.even {
    background-color: rgba(33, 150, 243, 0.15);
}

.odd {
    background-color: rgba(92, 107, 192, 0.15);
}
.scroll-visible {
    overflow-y: visible;
}
</style>
