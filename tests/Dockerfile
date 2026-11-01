# Python runs pytest and connects to Chrome in the separate Selenium service.
FROM python:3.12-slim

# Put test files in a predictable working directory inside the container.
WORKDIR /tests

# Install the small test dependency list before copying the test sources.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Selenium suite into the test image.
COPY . .

# Print each result as it finishes, show captured test output, and repeat all
# outcomes in pytest's final summary when Compose starts the test service.
CMD ["python", "-u", "-m", "pytest", "-vv", "-rA", "-s"]
