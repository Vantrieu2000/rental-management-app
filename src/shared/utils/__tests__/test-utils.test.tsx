describe('Test Utils', () => {
  it('should be configured correctly', () => {
    // Basic test to verify Jest is working
    expect(true).toBe(true);
  });

  it('should support async tests', async () => {
    const result = await Promise.resolve(42);
    expect(result).toBe(42);
  });
});
