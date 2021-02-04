import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import AddBookmark from './AddBookmark/AddBookmark';
import BookmarksContext from './BookmarksContext';
import BookmarkList from './BookmarkList/BookmarkList';
import Nav from './Nav/Nav';
import config from './config';
import './App.css';

import Rating from './Rating/Rating';



class App extends Component {

  state = {
    // - bookmarks,
    bookmarks: [],
    error: null,
  };

  // init.
  setBookmarks = bookmarks => {
    console.log(`b4 this.state.bookmarks :>> `, this.state.bookmarks); // dbg.
    this.setState({
      bookmarks,
      error: null,
    })
    console.log(`after this.state.bookmarks :>> `, this.state.bookmarks); // dbg.
  }

  addBookmark = bookmark => {
    console.log(`before this.state.bookmarks :>> `, this.state.bookmarks); // dbg.
    this.setState({
      bookmarks: [...this.state.bookmarks, bookmark],
    })

  }

  // CB use to override the empty deleteBookmark function in context.
  deleteBookmark = bookmarkId => {
    const newBookmarks = this.state.bookmarks.filter(bm =>
      bm.id !== bookmarkId
    )
    this.setState({
      bookmarks: newBookmarks
    })
  }


  componentDidMount() {
    fetch(config.API_ENDPOINT, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok)
          throw new Error(res.status)
        return res.json()
      })
      // bookmark response from api
      // .then(this.setBookmarks)
      .then(res => {
        this.setBookmarks(res)
      })

      .catch(error => this.setState({ error }))
  }

  render() {


    // const { bookmarks } = this.state
    const contextValue = {
      bookmarks: this.state.bookmarks,
      addBookmark: this.addBookmark,
      deleteBookmark: this.deleteBookmark,
    }

    return (
      <main className='App'>
        <h1>Bookmarks!</h1>
        <BookmarkList bookmarks={[{ a: 2, b: 4 }, { a: 9, b: 12 }]} />
        {/* <BookmarkList bookmarks={[1, 2, 3, 4, 5]} /> */}
        {/* <Rating value="hello" /> */}
        <Rating value={9} />


        {/*         
        <Nav />
        <div className='content' aria-live='polite'>
           */}

        <BookmarksContext.Provider value={contextValue}>
          <Nav />
          <div className='content' aria-live='polite'>

            {/* add form */}
            <Route
              path='/add-bookmark'


              // render={({ history }) => {
              //   return <AddBookmark
              //     onAddBookmark={this.addBookmark}
              //     onClickCancel={() => history.push('/')}
              //   />
              // }}
              component={AddBookmark}

            />
            <Route
              exact
              path='/'
              component={BookmarkList}
            // render={({ history }) => {
            //   return <BookmarkList bookmarks={bookmarks} />
            // }}

            />
          </div>
        </BookmarksContext.Provider>
      </main >
    );
  }
}

export default App;
