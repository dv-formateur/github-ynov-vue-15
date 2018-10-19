$(function () {
    $('input[name="datefilter"]').daterangepicker({
        autoUpdateInput: false,
        locale: {
            cancelLabel: 'Clear'
        }
    });

    $('input[name="datefilter"]').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
    });

    $('input[name="datefilter"]').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });
});

var app = new Vue({

    el: '#app',

    data: {
        branches: ['master'],
        currentBranch: 'master',
        commits: null,

        user: {
            name: '',
            fullName: '',
            github: ''
        },
        repository: {
            name: ''
        },

        projects: [],
        checkedNames: []
    },

    created: function () {
        this.fetchData()
    },

    watch: {
        currentBranch: 'fetchData'
    },

    filters: {
        truncate: function (v) {
            var newline = v.indexOf('\n')
            return newline > 0 ? v.slice(0, newline) : v
        },
        formatDate: function (v) {
            return v.replace(/T|Z/g, ' ')
        }
    },

    methods: {
        fetchData: function () {
            if (this.user.name != null && this.repository.name != null) {


                var data

                this.checkedNames.forEach(element => {
                    this.user.name = element
                    var userNameUrl = 'https://api.github.com/users/' + this.user.name + ''
                    var request = new XMLHttpRequest()
                    var that = this
                    request.open('GET', userNameUrl)
                    request.setRequestHeader('Authorization', 'Basic Zm91cm55LmdAZnJlZS5mcjpmb3VybnkzNw==')
                    request.onload = function () {
                        data = JSON.parse(request.responseText)
                        that.user.fullName = data.name
                        that.user.github = data.html_url
                    }
                    request.send()

                    var apiURL = 'https://api.github.com/repos/' + this.user.name + '/' + this.repository.name + '/commits?per_page=3&sha='
                    var xhr = new XMLHttpRequest()
                    var self = this
                    xhr.open('GET', apiURL + self.currentBranch)
                    xhr.setRequestHeader('Authorization', 'Basic Zm91cm55LmdAZnJlZS5mcjpmb3VybnkzNw==')
                    xhr.onload = function () {
                        self.commits = JSON.parse(xhr.responseText)
                    }
                    xhr.send()
                });
            }
        }
    },

    created() {
        fetch("https://api.github.com/search/repositories?q=github-ynov-vue", {
            headers: {
                "Authorization": "Basic Zm91cm55LmdAZnJlZS5mcjpmb3VybnkzNw=="
            },
            method: "GET"
        })
            .then(response => response.json())
            .then((data) => {
                this.projects = data.items
            })
    },
})