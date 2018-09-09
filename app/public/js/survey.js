$(document).ready(function() {
    // Questions listed in an array so they can be procedurally generated.
    var questions = [
        'My goals in life are clear.',
        'I am confident in what I do.',
        'I can work even when things are disorganised.',
        'I consistently put full time and effort into everything I do.',
        'My overall satisfaction with relationships have been positive.',
        'The quality of conversations with a friend are very important.',
        'Compatibility of your own life path is important.',
        'You the most important person in your relationship.',
        'I enjoy watching classic movies.',
        'I enjoy animals.'
    ];

    // Choices for personality questions.
    var choices = [
        '5 (Strongly Agree)',
        '4',
        '3',
        '2',
        '1 (Strongly Disagree)'
    ];

    // Identify div where questions will be inserted and initialize counter to 0.
    var questionDiv = $('#questions');
    i = 0;

    // For each question, create a div.
    questions.forEach(function (question) {
        i++;
        // Fill that div with a header, the question, and the choices selector.
        var item = $('<div class="question">');
        var headline = $('<h6>').text('Question ' + i);
        var questionText = $('<p>').text(question);
        var dropDown = $('<div class="form-group">');
        var select = $('<select class="form-control selector">');
        // Create an option for each choice.
        choices.forEach(function(choice) {
            var option = $('<option>').text(choice);
            select.append(option);
        });
        select.attr('id', 'select' + i);
        // Add the dropdown to the item, then add the item to the questions div.
        dropDown.append(select);
        item.append(headline, questionText, dropDown);
        var br = $('<br>');
        questionDiv.append(item, br);
    });

    // Event handler for when the form is submitted.
    $('#submit').on('click', function(event) {

        // Prevent reload.
        event.preventDefault();

        // Capture username and image link values.
        var name = $('#name').val();
        var imageLink = $('#imageLink').val();

        // If both of those items were filled out, gather other answers and submit.
        if (name.length > 0 && imageLink.length >0) {
            var answers = [];

            // Add the response for each selector to the array of answers.
            Object.keys($('.selector')).forEach(function(key) {
                if (answers.length < questions.length) {
                    // Take only the first character of the answer, which is the number.
                    answers.push($('.selector')[key].value.charAt(0));
                }
            });

            // Put the data in object form.
            var surveyData = {
                name: name,
                photo: imageLink,
                answers: answers
            };

            // POST that data to /api/friends.
            $.post('/api/friends', surveyData, function(data) {

                // Use data callback to display result.
                if (data) {

                    // Empty out modal and username and link fields.
                    $('#modalContent').empty();
                    $('#name').val('');
                    $('#imageLink').val('');

                    // The results are in array form. For each object, grab the name and URL.
                    data.forEach(function(profile) {
                        var profileDiv = $('<div class="profile">');
                        var name = profile.name;
                        var photoURL = profile.photo;
                        // Put the name in a header.
                        var nameHeader = $('<h3>').text(name);
                        // Add a photo with an 'src' of the photoURL submitted.
                        var photo = $('<img>').attr('src', photoURL);
                        profileDiv.append(nameHeader, photo);

                        // Add these items to the modal.
                        $('#modalContent').append(profileDiv);
                    });

                    // If there is a tie for the best match and so you have more than one,
                    if (data.length > 1) {
                        // Make sure the header is plural.
                        $('.modal-title').text('Your best matches!');
                    } else {
                        // Make sure the header is singular.
                        $('.modal-title').text('Your best match!');
                    }

                    // Display the result modal.
                    $('#resultModal').modal();
                }
            });
        // If either name or URL is missing, show the error modal.
        } else {
            $('#errorModal').modal();
            // The error modal can be dismissed but it will also disappear after 2 seconds.
            setTimeout(function() {
                $('#errorModal').modal('hide');
            }, 2000);
        }
    });
});