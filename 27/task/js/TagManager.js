(function ($) {
    "use strict";

    function TagManager (selector, list) {
        this.$root = $(selector);
        this.tagList = (list !== undefined && list.length) ? list : [];
        this.isEdit = false;

        this.$btnEdit = this.$root.find('#tagManagerEdit');
        this.$btnView = this.$root.find('#tagManagerView');
        this.$input = this.$root.find('#managerInput');
        this.$tagList = this.$root.find('#tagManagerList');
        this.$form = this.$root.find('form');

        ////

        this._eventsListener();
        this._generateInit();

        return this;
    }

    TagManager.prototype._eventsListener = function () {
        this.$btnEdit.on('click', this._onToggle.bind(this));
        this.$btnView.on('click', this._onToggle.bind(this));
        this.$form.on('submit', this._onSubmit.bind(this));
        this.$root.on('click', '.jsTagManagerRemove', this._onRemoveTag.bind(this));
    };

    /** Events */
    TagManager.prototype._onSubmit = function (e) {
        e.preventDefault();

        let newTag = this.trim(this.$input.val());

        if (newTag !== '' && $.inArray(newTag, this.tagList) === -1) {
            this.tagList.push(newTag);
            this._generateTagList();
            this.$input.val('');
        }
    };

    TagManager.prototype._onToggle = function () {
        this.isEdit = !this.isEdit;

        if (this.isEdit) {
            this.$btnEdit.show();
            this.$btnView.hide();
            this.$form.show();
            this.$root.find('.jsTagManagerRemove').each((i, elm) => {
                $(elm).show();
            });
        } else {
            this.$btnEdit.hide();
            this.$btnView.show();
            this.$form.hide();
            this.$root.find('.jsTagManagerRemove').each((i, elm) => {
                $(elm).hide();
            });
        }
    };

    TagManager.prototype._onRemoveTag = function (e) {
        let tagId = $(e.target).data('tagId');

        this.$tagList.find('#tagId_'+tagId).parent().remove();
        this.tagList.splice(tagId, 1);
        console.log(this.tagList);
    };

    /** DOM */
    TagManager.prototype._generateInit = function () {
        const _self = this;
        this.$btnEdit.hide();
        this.$form.hide();
        this.tagList.forEach((tag, id) => {
            _self.$tagList.append(_self._generateTag(tag, id));
        });
        this.$root.find('.jsTagManagerRemove').each((i, elm) => {
            $(elm).hide();
        });
    };

    TagManager.prototype._generateTagList = function () {
        let _self = this;
        this.$tagList.empty();
        this.tagList.forEach((tag, id) => {
            _self.$tagList.append(_self._generateTag(tag, id));
        });
    };

    TagManager.prototype._generateTag = function (tag, id) {
        return $('<span class="badge badge-pill badge-secondary tag-manager__badge">' +
            tag +
            '<span class="tag-manager__badge-btn jsTagManagerRemove" data-tag-id="'+ id +'" id="tagId_'+ id +'">&nbsp;&times;</span>' +
        '</span>');
    };

    TagManager.prototype.trim = function (string) {
        return (string) ? string.replace(/^\s+|\s+$/g, '') : string
    };

    window.TagManager = TagManager;
}(jQuery));
