const { test, expect } = require("@playwright/test")

// Verify user can add task
test("User can add task", async ({ page }) => {
    // Arrange
    await page.goto("http://localhost:8090/");

    // Act
    await page.fill("#task-input", "Test Task");
    await page.click("#add-task");

    // Assert
    const taskText = await page.textContent(".task");
    expect(taskText).toContain("Test Task");
})

// Verify user can delete task
test("User can delete task", async ({ page }) => {
    // Arrange
    await page.goto("http://localhost:8090/");
    await page.fill("#task-input", "Test Task");
    await page.click("#add-task");

    // Act
    await page.click(".task .delete-task");

    // Assert
    const tasks = await page.$$eval(".task", tasks => tasks.map(
        task => task.textContent
    ));

    expect(tasks).not.toContain("Test Task");
})

// Verify user can marked task as complete 
test("user can mark task as complete", async ({ page }) => {
    // Arrange
    await page.goto("http://localhost:8090/");
    await page.fill("#task-input", "Test Task");
    await page.click("#add-task");

    // Act
    await page.click(".task .task-complete");

    // Assert
    const completedTask = await page.$(".task.completed");

    expect(completedTask).not.toBeNull();
})

// Verify user can filter tests
test("user can filter tests", async ({ page }) => {
    // Arrange
    await page.goto("http://localhost:8090/");
    await page.fill("#task-input", "Test Task");
    await page.click("#add-task");
    await page.click(".task .task-complete");

    // Act
    await page.selectOption("#filter", "completed");

    // Assert
    const incompleteTasks = await page.$(".task:not(.completed)");

    expect(incompleteTasks).toBeNull();
})