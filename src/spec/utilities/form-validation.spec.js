describe("jQuery is installed", function () {
  it("Should find jQuery", function () {
    expect($).not.toBeNull();
  });
});