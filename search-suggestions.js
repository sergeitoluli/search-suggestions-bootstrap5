document.addEventListener('DOMContentLoaded', function () {

    const suggestionsList = document.getElementById('suggestionsList');
    const searchInput = document.getElementById('searchInput');
    const searchFormButton = document.getElementById('searchFormButton')

    function clearInput() {
        searchInput.value = '';
        suggestionsList.innerHTML = '';
    }

    window.onload = clearInput;

    searchInput.addEventListener('input', function () {
        suggestionsList.style.display = 'block'
        const searchTerm = searchInput.value;

        if (searchTerm.trim() === '') {
            clearInput()
            return;
        }

        fetch(`http://127.0.0.1:8000/search?q=${searchTerm}&term=api`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                suggestionsList.innerHTML = '';
                suggestions = data.data
                if (!Array.isArray(suggestions)) {
                    console.error('Invalid response format. Expected an array.');
                    return;
                }
                renderSuggestions(suggestions)
            })
            .catch(error => console.error('Error:', error));
    });

    function renderSuggestions(suggestions) {
        suggestions.forEach(suggestion => {
            const linkItem = document.createElement('a');
            linkItem.href = `{{route('results')}}?q=${suggestion.name}`;
            const listItem = document.createElement('div');
            listItem.classList.add("p-1");
            listItem.classList.add("fw-bold");
            listItem.classList.add("searchListItem");
            listItem.innerHTML = `<p class="p-1 text-lowercase m-0">${suggestion.name}</p>`;
            listItem.style.cursor = "pointer";

            listItem.addEventListener('click', function (event) {
                event.preventDefault();
                searchInput.value = suggestion.name;
                suggestionsList.innerHTML = '';
                searchFormButton.click();
            });

            suggestionsList.appendChild(listItem);
        });
    }

    searchInput.addEventListener('keydown', function (event) {
        const key = event.key;

        if (key === 'ArrowDown') {
            event.preventDefault();
            highlightNextSuggestion();
        }

        if (key === 'ArrowUp') {
            event.preventDefault();
            highlightPreviousSuggestion();
        }
    });

    searchInput.addEventListener('blur', function (event) {
        suggestionsList.style.display = 'none';
    })

    searchInput.addEventListener('focus', function (event) {
        if (suggestionsList.innerHTML != '') {
            suggestionsList.style.display = 'block'
        }
    })
    let selectedSuggestionIndex = -1;
    function highlightNextSuggestion() {
        const suggestions = document.querySelectorAll('.searchListItem');

        if (selectedSuggestionIndex < suggestions.length - 1) {
            selectedSuggestionIndex++;
        } else {
            selectedSuggestionIndex = 0;
        }

        suggestions.forEach(suggestion => suggestion.classList.remove('background-gray'));
        
        searchInput.value = suggestions[selectedSuggestionIndex].childNodes[0].outerText
        
        suggestions[selectedSuggestionIndex].classList.add('background-gray');
    }

    function highlightPreviousSuggestion() {
        const suggestions = document.querySelectorAll('.searchListItem');
        if (selectedSuggestionIndex > 0) {
            
            selectedSuggestionIndex--;
        } else {
            
            selectedSuggestionIndex = suggestions.length - 1;
        }
        // Remove the 'highlight' class from all suggestions
        suggestions.forEach(suggestion => suggestion.classList.remove('background-gray'));
        //console.log(suggestions[selectedSuggestionIndex].childNodes[0].outerText)
        searchInput.value = suggestions[selectedSuggestionIndex].childNodes[0].outerText
        // Add the 'highlight' class to the currently selected suggestion
        suggestions[selectedSuggestionIndex].classList.add('background-gray');
    }
});