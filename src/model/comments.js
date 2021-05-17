import Observer from '../utils/observer';

export default class Comments extends Observer {
  constructor() {
    super();

    this._comments = [];
  }

  setComments(comments) {
    this._comments = comments.slice();
  }

  getComments() {
    return this._comments;
  }

  // updateComment(updateType, update) {
  //   const index = this._comments.findIndex((comment) => comment.id === update.id);
  //
  //   if (index === -1) {
  //     throw new Error('Can\'t update unexisting comment');
  //   }
  //
  //   this._comments = [
  //     ...this._comments.slice(0, index),
  //     update,
  //     ...this._comments.slice(index + 1),
  //   ];
  //
  //   this._notify(updateType, update);
  // }

  addComment(updateType, update) {
    this._comments = [
      update,
      ...this._comments,
    ];

    this._notify(updateType, update);
  }

  deleteComment(updateType, updateFilm, updateId) {
    const index = this._comments.findIndex((comment) => comment.id === updateId);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1),
    ];

    window.comments[updateFilm.id] = [
      ...window.comments[updateFilm.id].slice(0, index),
      ...window.comments[updateFilm.id].slice(index + 1),
    ];

    this._notify(updateType, updateFilm);
  }
}
