// URL for the data source
const URL = 'https://data.gov.bh/api/explore/v2.1/catalog/datasets/01-statistics-of-students-nationalities_updated/records';

// Function to create and configure the table
function createTable() {
    // Create container
    const container = document.createElement('div');
    container.className = 'container';

    // Create title
    const title = document.createElement('h1');
    title.textContent = 'Student Table';

    // Create error container
    const errorContainer = document.createElement('div');
    errorContainer.id = 'errorContainer';
    errorContainer.style.color = 'red';

    // Create table
    const table = document.createElement('table');
    table.id = 'studentTable';

    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ['Year', 'Semester', 'College', 'Program', 'Nationality', 'Number of Students'];
    
    headers.forEach(headerText => {
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

    // Append elements to container
    container.appendChild(title);
    container.appendChild(errorContainer);
    container.appendChild(table);

    // Add to document body
    document.body.appendChild(container);

    return {
        tableBody: tbody,
        errorContainer: errorContainer
    };
}

// Function to fetch and display student data
async function fetchStudentData() {
    try {
        // Construct URL with query parameters
        const params = new URLSearchParams({
            where: "colleges like 'IT' AND the_programs like 'bachelor'",
            limit: '100'
        });
        
        const fullUrl = `${URL}?${params.toString()}`;
        
        // Fetch data
        const response = await fetch(fullUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        // Log the full response for debugging
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        // Check if the response is successful
        if (!response.ok) {
            // Try to get error details from response
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
        }
        
        // Parse the JSON response
        const data = await response.json();
        
        // Create table structure
        const { tableBody, errorContainer } = createTable();
        
        // Clear any existing rows and errors
        tableBody.innerHTML = '';
        errorContainer.innerHTML = '';
        
        // Check if results exist
        if (data.results && data.results.length > 0) {
            // Loop through each record and create table rows
            data.results.forEach(record => {
                const row = document.createElement('tr');
                
                // Create table cells for each piece of data
                const cells = [
                    record.year ?? 'N/A',
                    record.semester ?? 'N/A',
                    record.colleges ?? 'N/A',
                    record.the_programs ?? 'N/A',
                    record.nationality ?? 'N/A',
                    record.number_of_students ?? 'N/A'
                ];
                
                // Add cells to the row
                cells.forEach(cellData => {
                    const cell = document.createElement('td');
                    cell.textContent = cellData;
                    row.appendChild(cell);
                });
                
                // Add row to table body
                tableBody.appendChild(row);
            });
        } else {
            // If no data is found, create a row indicating that
            errorContainer.textContent = 'No data found for the specified criteria.';
            const noDataRow = document.createElement('tr');
            const noDataCell = document.createElement('td');
            noDataCell.colSpan = 6;
            noDataCell.textContent = 'No data found';
            noDataRow.appendChild(noDataCell);
            tableBody.appendChild(noDataRow);
        }
    } catch (error) {
        console.error('Error fetching student data:', error);
        
        // Create table structure to ensure error container exists
        const { errorContainer } = createTable();
        
        // Display error in the dedicated error container
        errorContainer.textContent = `Error: ${error.message}`;
    }
}

// Add stylesheet dynamically
function addStylesheet() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css';
    document.head.appendChild(link);
}

// Call functions when the page loads
document.addEventListener('DOMContentLoaded', () => {
    addStylesheet();
    fetchStudentData();
});