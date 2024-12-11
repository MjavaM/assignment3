// Function to create the entire HTML structure and fetch data
async function createAndPopulateTable() {
    // Root element for the app
    const app = document.getElementById('app');
    
    // Create container
    const container = document.createElement('div');
    container.className = 'container';
    
    // Create title
    const title = document.createElement('h1');
    title.textContent = 'Student Table';
    container.appendChild(title);
    
    // Create table
    const table = document.createElement('table');
    table.id = 'studentTable';
    
    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Year', 'Semester', 'College', 'Program', 'Nationality', 'Number of Students'].forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create table body
    const tbody = document.createElement('tbody');
    tbody.id = 'tableBody';
    table.appendChild(tbody);
    
    container.appendChild(table);
    app.appendChild(container);
    
    // Link Pico CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css';
    document.head.appendChild(link);
    
    // Fetch and populate data
    await fetchStudentData();
}

// Function to fetch and display student data
async function fetchStudentData() {
    const URL = "https://data.gov.bh/api/explore/v2.1/catalog/datasets/01-statistics-of-students-nationalities_updated/records?where=colleges%20like%20%22IT%22%20AND%20the_programs%20like%20%22bachelor%22&limit=100";

    try {
        const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(URL);
        const response = await fetch(proxyUrl, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = '';

        if (data.results && data.results.length > 0) {
            data.results.forEach(record => {
                const row = document.createElement('tr');
                const cells = [
                    record.year ?? 'N/A',
                    record.semester ?? 'N/A',
                    record.colleges ?? 'N/A',
                    record.the_programs ?? 'N/A',
                    record.nationality ?? 'N/A',
                    record.number_of_students ?? 'N/A'
                ];
                cells.forEach(cellData => {
                    const cell = document.createElement('td');
                    cell.textContent = cellData;
                    row.appendChild(cell);
                });
                tableBody.appendChild(row);
            });
        } else {
            const noDataRow = document.createElement('tr');
            const noDataCell = document.createElement('td');
            noDataCell.colSpan = 6;
            noDataCell.textContent = 'No data found';
            noDataRow.appendChild(noDataCell);
            tableBody.appendChild(noDataRow);
        }
    } catch (error) {
        const tableBody = document.getElementById('tableBody');
        const errorRow = document.createElement('tr');
        const errorCell = document.createElement('td');
        errorCell.colSpan = 6;
        errorCell.textContent = `Error: ${error.message}`;
        errorCell.style.color = 'red';
        errorRow.appendChild(errorCell);
        tableBody.appendChild(errorRow);
    }
}

// Initialize app and populate table
document.addEventListener('DOMContentLoaded', () => {
    // Create a root element to hold the app
    const root = document.createElement('div');
    root.id = 'app';
    document.body.appendChild(root);

    // Call the function to create table and populate data
    createAndPopulateTable();
});
