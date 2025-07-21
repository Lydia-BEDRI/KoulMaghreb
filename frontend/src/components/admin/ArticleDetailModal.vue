<template>
    <transition name="modal-fade">
        <div
            v-if="show"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            role="dialog"
            aria-modal="true"
            @click.self="$emit('close')"
        >
            <div
                class="bg-white rounded-xl shadow-2xl w-full max-w-5xl flex flex-col overflow-hidden relative max-h-[90vh]"
            >
                <div class="relative p-6 border-b">
                    <button
                        @click="$emit('close')"
                        aria-label="Fermer la fenêtre de détails"
                        class="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-primary hover:text-red-500 hover:scale-110 duration-150"
                    >
                        <Icon icon="mdi:close" class="text-xl" />
                    </button>
                    <h2 class="text-2xl font-bold text-center text-accent mb-2">
                        {{ modeCreation ? 'Créer un nouvel article' : `Détails de l'article` }}
                    </h2>
                    <p class="text-sm text-center text-gray-500">
                        {{ modeCreation ? 'Saisir les informations de l\'article' : article?.title + ' - Gestion administrative' }}
                    </p>
                </div>
                <div class="flex-1 overflow-y-auto p-6 space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-base font-bold text-gray-700 mb-1">ID Article</label>
                            <input 
                                :value="modeCreation ? 'Généré automatiquement' : article?.id" 
                                disabled 
                                class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label class="block text-base font-bold text-gray-700 mb-1">Date de création</label>
                            <input 
                                v-model="editableArticle.created_at"
                                type="date"
                                class="w-full px-4 py-2 border-2 border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-gray-400 transition-colors"
                            />
                        </div>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-primary mb-4">Informations de base</h3>
                        <div class="grid grid-cols-1 gap-4">
                            <div>
                                <label class="block text-base font-bold text-gray-700 mb-1">Titre de l'article *</label>
                                <input 
                                    v-model="editableArticle.title"
                                    placeholder="Ex: Le Couscous : Roi des plats maghrébins"
                                    class="w-full px-4 py-2 border-2 border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-gray-400 transition-colors"
                                />
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-base font-bold text-gray-700 mb-1">Slug (URL) *</label>
                                    <input 
                                        v-model="editableArticle.slug"
                                        placeholder="Ex: couscous-roi-des-plats"
                                        class="w-full px-4 py-2 border-2 border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-gray-400 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label class="block text-base font-bold text-gray-700 mb-1">Catégorie *</label>
                                    <select 
                                        v-model="editableArticle.category"
                                        class="w-full px-4 py-2 border-2 border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-gray-400 transition-colors"
                                    >
                                        <option value="Culture">Culture</option>
                                        <option value="Tradition">Tradition</option>
                                        <option value="Ingrédients">Ingrédients</option>
                                        <option value="Desserts">Desserts</option>
                                        <option value="Événements">Événements</option>
                                        <option value="Rencontre">Rencontre</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label class="block text-base font-bold text-gray-700 mb-1">Image URL *</label>
                                <input 
                                    v-model="editableArticle.image"
                                    placeholder="Ex: /img/articles/mon-article.jpeg"
                                    class="w-full px-4 py-2 border-2 border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-gray-400 transition-colors"
                                />
                                <p class="text-xs text-gray-500 mt-1">
                                    Exemples : /img/articles/couscous.jpeg ou https://exemple.com/image.jpg
                                </p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-primary mb-4">Contenu de l'article</h3>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-base font-bold text-gray-700 mb-1">Extrait (résumé) *</label>
                                <textarea 
                                    v-model="editableArticle.excerpt"
                                    placeholder="Résumé court de l'article affiché sur la liste..."
                                    rows="2"
                                    class="w-full px-4 py-2 border-2 border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-gray-400 transition-colors placeholder-gray-400"
                                ></textarea>
                            </div>
                            <div>
                                <label class="block text-base font-bold text-gray-700 mb-1">Contenu complet *</label>
                                <textarea 
                                    v-model="editableArticle.content"
                                    placeholder="Contenu détaillé de l'article..."
                                    rows="8"
                                    class="w-full px-4 py-2 border-2 border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-gray-400 transition-colors placeholder-gray-400"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                    <div v-if="editableArticle.image">
                        <h3 class="text-lg font-semibold text-primary mb-4">Aperçu de l'image</h3>
                        <div class="w-full max-w-md mx-auto">
                            <img 
                                :src="editableArticle.image" 
                                :alt="editableArticle.title"
                                class="w-full h-48 object-cover rounded-xl border border-gray-200"
                                @error="$event.target.style.display = 'none'"
                            />
                        </div>
                    </div>
                    <div v-if="!modeCreation">
                        <h3 class="text-lg font-semibold text-primary mb-4">Statistiques</h3>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-base font-bold text-gray-700 mb-1">Nombre de mots</label>
                                <input 
                                    :value="editableArticle.content ? editableArticle.content.split(' ').length : 0" 
                                    disabled 
                                    class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label class="block text-base font-bold text-gray-700 mb-1">Longueur extrait</label>
                                <input 
                                    :value="editableArticle.excerpt ? editableArticle.excerpt.length : 0" 
                                    disabled 
                                    class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label class="block text-base font-bold text-gray-700 mb-1">Longueur titre</label>
                                <input 
                                    :value="editableArticle.title ? editableArticle.title.length : 0" 
                                    disabled 
                                    class="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex justify-end gap-3 p-6 border-t bg-gray-50">
                    <button 
                        @click="$emit('close')"
                        class="flex items-center justify-center w-12 h-12 text-gray-600 hover:text-gray-800 transition rounded-xl hover:bg-gray-200"
                        title="Annuler"
                    >
                        <Icon icon="mdi:close" class="text-2xl" />
                    </button>
                    <button 
                        @click="sauvegarder"
                        class="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-xl hover:bg-accent transition shadow-md hover:shadow-lg"
                        :title="modeCreation ? 'Créer l\'article' : 'Sauvegarder les modifications'"
                    >
                        <Icon icon="mdi:content-save" class="text-2xl" />
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
    show: Boolean,
    article: Object,
    modeCreation: Boolean
})

const emit = defineEmits(['close', 'update'])

const editableArticle = ref({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '',
    category: 'Culture',
    created_at: ''
})

watch(() => props.article, (newArticle) => {
    if (newArticle) {
        editableArticle.value = {
            title: newArticle.title || '',
            slug: newArticle.slug || '',
            excerpt: newArticle.excerpt || '',
            content: newArticle.content ?? newArticle.long_desc ?? '', 
            image: newArticle.image || '',
            category: newArticle.category || 'Culture',
            created_at: newArticle.created_at 
                ? newArticle.created_at.split('T')[0] 
                : new Date().toISOString().split('T')[0]
        }
    }
}, { immediate: true })

const sauvegarder = () => {
    if (!editableArticle.value.title || !editableArticle.value.slug || 
            !editableArticle.value.excerpt || !editableArticle.value.content || 
            !editableArticle.value.image) {
        alert('Veuillez remplir tous les champs obligatoires (*).')
        return
    }
    emit('update', {
        id: props.article?.id,
        title: editableArticle.value.title,
        slug: editableArticle.value.slug,
        excerpt: editableArticle.value.excerpt,
        content: editableArticle.value.content,
        image: editableArticle.value.image,
        category: editableArticle.value.category,
        created_at: editableArticle.value.created_at
    })
    emit('close')
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.4s ease, transform 0.4s ease;
}

.modal-fade-enter-from {
    opacity: 0;
    transform: scale(0.9); 
}

.modal-fade-enter-to {
    opacity: 1;
    transform: scale(1);
}

.modal-fade-leave-from {
    opacity: 1;
    transform: scale(1); 
}

.modal-fade-leave-to {
    opacity: 0;
    transform: scale(0.9); 
}
</style>
