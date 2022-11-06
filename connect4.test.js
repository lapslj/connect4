describe("checking tie test",function(){
    it('when every box is filled, check for tie', () =>
    {
    board = [
        [1, 1, 2, 1, 2, 1, 2],
        [1, 1, 2, 1, 2, 1, 2],
        [1, 1, 2, 1, 2, 1, 2],
        [1, 1, 2, 1, 2, 1, 2],
        [1, 1, 2, 1, 2, 1, 2],
        [1, 1, 2, 1, 2, 1, 2]];
      expect(tieCheck()).toBe(true);
    })
}
)
  