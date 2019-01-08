<template>
    <div class="article-admin">
        <b-form>
            <input type="hidden" id="article-id" v-model="article.id">
            <b-row>
                <b-col xs="12">
                    <b-form-group label="Nome:" label-for="article-name">
                        <b-form-input id="article-name" type="text" placeholder="Nome do Artigo"
                                      v-model="article.name" :readonly="mode === 'remove'"/>
                    </b-form-group>
                    <b-form-group label="Descrição:" label-for="article-description">
                        <b-form-input id="article-description" type="text" placeholder="Descrição do Artigo"
                                      v-model="article.description" :readonly="mode === 'remove'" />
                    </b-form-group>
                    <b-form-group label="Imagem(URL):" label-for="article-imageUrl">
                        <b-form-input id="article-img" type="text" placeholder="Url da Imagem"
                                      v-model="article.imageUrl" :readonly="mode === 'remove'" />
                    </b-form-group>
                    <b-form-group label="Categoria:" label-for="article-categoryId">
                        <b-form-select id="article-categoryId" :options="categories" v-model="article.categoryId"
                                       :readonly="mode === 'remove'" :disabled="mode === 'remove'" />
                    </b-form-group>
                    <b-form-group label="Autor" label-for="article.userId">
                        <b-form-select id="article-userId" :options="users" v-model="article.userId"
                                       :readonly="mode === 'remove'" :disabled="mode === 'remove'" />
                    </b-form-group>
                    <b-form-group label="Conteúdo:" label-for="article-content">
                        <VueEditor v-model="article.content" placeholder="Conteúdo do Artigo..."
                                   :readonly="mode === 'remove'" :disabled="mode === 'remove'" />
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col xs="12">
                    <b-button variant="primary" v-if="mode === 'save'" @click="save">Salvar</b-button>
                    <b-button variant="danger" v-if="mode === 'remove'" @click="remove">Excluir</b-button>
                    <b-button class="ml-2" @click="reset">Cancelar</b-button>
                </b-col>
            </b-row>
        </b-form>
        <hr>
        <b-table hover striped :items="articles" :fields="fields">
            <template slot="actions" slot-scope="data">
                <b-button class="mr-2" variant="warning" @click="loadArticle(data.item)">
                    <i class="fa fa-pencil"></i>
                </b-button>
                <b-button class="mr-2" variant="danger" @click="loadArticle(data.item, 'remove')">
                    <i class="fa fa-trash"></i>
                </b-button>
            </template>
        </b-table>
        <b-pagination size="md" v-model="page" :total-rows="count" :per-page="limit" />
    </div>
</template>

<script>
    import {  VueEditor } from 'vue2-editor';
    import { baseApiUrl, showError } from "@/global";
    import axios from 'axios';

    export default {
        name: 'ArticleAdmin',
        components: { VueEditor },
        data: function () {
            return {
                mode: 'save',
                article: {},
                articles: [],
                categories: [],
                users: [],
                page: 1,
                limit: 0,
                count: 0,
                fields: [
                    { key: 'id', label: 'Código', sortable: true },
                    { key: 'name', label: 'Nome', sortable: true },
                    { key: 'description', label: 'Descrição', sortable: true },
                    { key: 'actions', label: 'Ações', sortable: true }
                ]
            }
        },
        methods: {
            loadArticles() {
                const url = `${baseApiUrl}/articles?page=${this.page}`;

                axios.get(url).then(res => {
                    this.articles = res.data.data;
                    this.count = res.data.count;
                    this.limit = res.data.limit
                });
            },
            reset() {
                this.mode = 'save';
                this.article = {};
                this.loadArticles()
            },
            save() {
                const method = this.article.id ? 'put' : 'post';
                const id = this.article.id ? `/${this.article.id}` : '';

                axios[method](`${baseApiUrl}/articles${id}`, this.article)
                    .then(() => {
                        this.$toasted.global.defaultSuccess();
                        this.reset()
                    }).catch(showError);
            },
            remove() {
                const id = this.article.id;

                axios.delete(`${baseApiUrl}/articles/${id}`)
                    .then(() => {
                        this.$toasted.global.defaultSuccess();
                        this.reset()
                    }).catch(showError);
            },
            loadArticle(article, mode = 'save') {
                this.mode = mode;

                axios.get(`${baseApiUrl}/articles/${article.id}`)
                    .then(res => this.article = res.data)
            },
            loadCategories() {
                const url = `${baseApiUrl}/categories`;

                axios.get(url).then(res => {
                    this.categories = res.data.map(category => {
                        return { value: category.id, text: category.path }
                    })
                });
            },
            loadUsers() {
                const url = `${baseApiUrl}/users`;

                axios.get(url).then(res => {
                    this.users = res.data.map(user => {
                        return { value: user.id, text: `${user.name} - ${user.email}` }
                    })
                })
            }
        },
        watch: {
            page() {
                this.loadArticles()
            }
        },
        mounted() {
            this.loadUsers();
            this.loadCategories();
            this.loadArticles()
        }
    }
</script>

<style>

</style>