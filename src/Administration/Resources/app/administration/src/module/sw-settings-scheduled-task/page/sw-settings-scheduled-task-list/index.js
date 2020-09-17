import template from './sw-settings-scheduled-task-list.html.twig';
import './sw-settings-scheduled-task-list.scss';

const { Component, Mixin, Context } = Shopware;
const { Criteria } = Shopware.Data;

Component.register('sw-settings-scheduled-task-list', {
    template,

    mixins: [
        Mixin.getByName('listing'),
        Mixin.getByName('placeholder'),
        Mixin.getByName('notification')
    ],

    inject: ['repositoryFactory', 'acl'],

    data() {
        return {
            scheduledTasks: null,
            isLoading: false,
            sortBy: 'createdAt',
            sortDirection: 'DESC'
        };
    },

    metaInfo() {
        return {
            title: this.$createTitle()
        };
    },

    computed: {
        scheduledTaskRepository() {
            return this.repositoryFactory.create('scheduled_task');
        }
    },

    methods: {
        async getList() {
            const criteria = new Criteria(this.page, this.limit);
            criteria.setTerm(this.term);
            criteria.addSorting(Criteria.sort(this.sortBy, this.sortDirection));

            this.isLoading = true;
            try {
                this.scheduledTasks = await this.scheduledTaskRepository.search(criteria, Context.api);
                this.total = this.scheduledTasks.total;
            } catch (error) {
                this.createNotificationError({
                    title: this.$tc('global.default.error'),
                    message: this.$tc('sw-settings-scheduled-task.list.errorLoad')
                });

                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        scheduledTaskColumns() {
            return [{
                property: 'name',
                label: 'sw-settings-scheduled-task.list.columnName',
                primary: true
            }, {
                property: 'runInterval',
                label: 'sw-settings-scheduled-task.list.columnRunInterval',
                inlineEdit: 'number'
            }, {
                property: 'lastExecutionTime',
                label: 'sw-settings-scheduled-task.list.columnLastExecutionTime'
            }, {
                property: 'nextExecutionTime',
                label: 'sw-settings-scheduled-task.list.columnNextExecutionTime',
                inlineEdit: 'datetime'
            }];
        }
    }
});
