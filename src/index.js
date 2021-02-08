const quotesUrl = "http://localhost:3000/quotes";
const likesUrl = "http://localhost:3000/likes";

const quoteList = document.getElementById( "quote-list" );
const newQuoteForm = document.getElementById( "new-quote-form" );

function fetchQuotes() {
    fetch( `${ quotesUrl }?_embed=likes` )
        .then( response => response.json() )
        .then( quoteData => quoteData.forEach( quote => renderQuote( quote ) ) );
}

function renderQuote( quote ) {
    const quoteCard = document.createElement( "li" );
    quoteCard.dataset.id = quote.id;
    quoteCard.classList.add( "quote-card" );
    const blockQuote = document.createElement( "blockquote" );
    blockQuote.classList.add( "blockquote" );
    const quoteContent = document.createElement( "p" );
    quoteContent.classList.add( "mb-0" );
    quoteContent.textContent = quote.quote;
    const quoteAuthor = document.createElement( "footer" );
    quoteAuthor.classList.add( "blockquote-footer" );
    quoteAuthor.textContent = quote.author;
    const lineBreak = document.createElement( "br" );
    const likeButton = document.createElement( "button" );
    likeButton.dataset.likes = quote.likes.length;
    likeButton.classList.add( "btn-success" );
    likeButton.innerHTML = `Likes: <span>${ quote.likes.length }</span>`;
    const deleteButton = document.createElement( "button" );
    deleteButton.classList.add( "btn-danger" );
    deleteButton.textContent = "Delete";
    blockQuote.append( quoteContent, quoteAuthor, lineBreak, likeButton, deleteButton );
    quoteCard.append( blockQuote );
    quoteList.append( quoteCard );
}

function createQuote( quoteSubmission ) {
    quoteSubmission.preventDefault();
    const newQuote = {
        quote: newQuoteForm.elements[ 0 ].value,
        author: newQuoteForm.elements[ 1 ].value,
        likes: []
    };
    fetch( quotesUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify( newQuote ) } )
        .then( response => response.json() )
        .then( quoteData => renderQuote( quoteData ) );
}

function handleQuoteClick( quoteClick ) {
    if ( quoteClick.target.classList.value === "btn-success" ) { likeQuote( quoteClick.target.closest( "li" ).dataset.id ); }
    if ( quoteClick.target.classList.value === "btn-danger" ) { deleteQuote( quoteClick.target.closest( "li" ).dataset.id ); }
}

function likeQuote( quoteID ) {
    const quoteToLike = document.querySelector( `li[data-id="${ quoteID }"]` );
    const newLike = {
        quoteId: parseInt( quoteID ),
        createdAt: Date.now(),
    }
    fetch( likesUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify( newLike ) } )
        .then( response => response.json() )
        .then( () => {
            const currentNumberOfLikes = quoteToLike.querySelector( "button.btn-success" ).textContent.slice( 7 );
            quoteToLike.querySelector( "button.btn-success" ).textContent = `Likes: ${ parseInt( currentNumberOfLikes ) + 1 }`;
            quoteToLike.querySelector( "button.btn-success" ).dataset.likes = parseInt( currentNumberOfLikes ) + 1;
        } );
}

function deleteQuote( quoteID ) {
    const quoteToDelete = document.querySelector( `li[data-id="${ quoteID }"]` );
    fetch( `${ quotesUrl }/${ quoteID }`, { method: "DELETE" } )
        .then( response => response.json() )
        .then( () => quoteToDelete.remove() );
}

document.addEventListener( "DOMContentLoaded", () => {
    fetchQuotes();
    quoteList.addEventListener( "click", handleQuoteClick );
    newQuoteForm.addEventListener( "submit", createQuote );
} );