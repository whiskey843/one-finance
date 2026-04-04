// Job Application Logic
function applyForJob(position) {
    document.getElementById('jobPosition').value = position;
    document.getElementById('jobApplicationForm').reset();
    document.getElementById('contact-job').scrollIntoView({ behavior: 'smooth' });
}

// Handle job application form submission
document.addEventListener('DOMContentLoaded', function () {
    const jobApplicationForm = document.getElementById('jobApplicationForm');
    
    if (jobApplicationForm) {
        jobApplicationForm.addEventListener('submit', function (e) {
            e.preventDefault();
            
            const position = document.getElementById('jobPosition').value;
            const name = document.getElementById('applicantName').value;
            const email = document.getElementById('applicantEmail').value;
            const phone = document.getElementById('applicantPhone').value;
            const message = document.getElementById('applicantMessage').value;
            const cv = document.getElementById('applicantCV').files[0];

            if (!position) {
                alert('Ju lutemi zgjedhni një pozicion');
                return;
            }

            if (!name || !email || !phone || !message || !cv) {
                alert('Ju lutemi plotësoni të gjitha fushat e detyrueshme');
                return;
            }

            // Here you would normally send this data to a server
            // For now, just show a success message
            alert(`Faleminderit ${name}!\n\nAplicimi juaj për pozicionin "${position}" është dërguar me sukses.\n\nNe do t'ju kontaktojmë në adresën ${email} brenda 3-5 ditësh.`);
            
            jobApplicationForm.reset();
        });
    }
});

// Add smooth scrolling for the apply buttons
document.querySelectorAll('.apply-btn').forEach(button => {
    button.addEventListener('click', function (e) {
        e.preventDefault();
    });
});
