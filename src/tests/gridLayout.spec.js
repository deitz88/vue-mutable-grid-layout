import { shallowMount } from '@vue/test-utils';
import GridLayout from '../components/GridLayout';
import GridModule from '../components/GridModule';

describe('GridLayout', () => {
  let wrapper;
  const createWrapper = (propsData = {}) => {
    wrapper = shallowMount(GridLayout, {
      propsData: {
        items: [],
        cols: 3,
        rows: 2,
        gridWidth: '100%',
        gridHeight: '100%',
        itemGap: 15,
        highlightCellOnMove: true,
        highlightOnMoveClass: 'highlighted-cell',
        borderRadius: 0,
        showScrollOnOverflow: true,
        beta__cellSize: false,
        ...propsData
      },
      stubs: { GridModule },
    });
  };

  beforeEach(() => {
    consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    wrapper.unmount();
    consoleErrorMock.mockRestore();
  });

  it('renders without errors', () => {
    createWrapper();
    expect(wrapper.exists()).toBeTruthy();
  });

  it('displays error when too many active items are passed', async () => {
    createWrapper({ items: new Array(7).fill({ id: 1, active: true }) });
    expect(wrapper.vm.error).toBe('Overflow Error');
  });

  it('computes processedItems correctly', () => {
    createWrapper({ items: [{ id: 1, active: true }, { id: 2, active: false }] });
    expect(wrapper.vm.processedItems.length).toBe(1);
  });

  it('normalizes size correctly', () => {
    createWrapper();
    expect(wrapper.vm.normalizeSize(100)).toBe('100px');
    expect(wrapper.vm.normalizeSize('100%')).toBe('100%');
  });

  it('sets draggingItem on itemDragStart', () => {
    createWrapper();
    const item = { id: 1, x: 0, y: 0 };
    wrapper.vm.itemDragStart(item);
    expect(wrapper.vm.draggingItem).toEqual(item);
  });

  it('clears draggingItem on itemDragEnd', () => {
    createWrapper();
    wrapper.vm.itemDragEnd();
    expect(wrapper.vm.draggingItem).toBeNull();
  });

  // it('handles item hover events correctly', async () => {
  //   createWrapper();
  //   jest.useFakeTimers();
  //   const event = new Event('dragenter');
  //   const cell = { x: 0, y: 0 };
  //   wrapper.vm.onItemHoverStart(event, cell);
  //   jest.runAllTimers();
  //   expect(wrapper.vm.hoveredCell).toEqual(cell);
  //   wrapper.vm.onItemHoverEnd(event, cell);
  //   expect(wrapper.vm.hoveredCell).toBeNull();
  // });

  it('validates item positions correctly', () => {
    createWrapper({ cols: 2, rows: 2 });
    expect(wrapper.vm.isPositionValid({ x: 0, y: 0 }, { width: 1, height: 1 })).toBeTruthy();
    expect(wrapper.vm.isPositionValid({ x: 2, y: 2 }, { width: 1, height: 1 })).toBeFalsy();
  });

  it('checks if spots are occupied correctly', () => {
    createWrapper({
      items: [
        { id: 1, active: true, x: 0, y: 0, width: 1, height: 1 },
        { id: 2, active: true, x: 1, y: 1, width: 1, height: 1 }
      ]
    });
    const newPosition = { x: 1, y: 1 };
    const item = { id: 1, width: 1, height: 1 };
    expect(wrapper.vm.isSpotOccupied(newPosition, item).overlap).toBeTruthy();
  });

  it('swaps positions correctly', () => {
    createWrapper({
      items: [
        { id: 1, active: true, x: 0, y: 0, width: 1, height: 1 },
        { id: 2, active: true, x: 1, y: 1, width: 1, height: 1 }
      ]
    });
    const item1 = wrapper.vm.processedItems[0];
    const item2 = wrapper.vm.processedItems[1];
    wrapper.vm.swapPositions(item1, item2);
    expect(wrapper.vm.processedItems[0].x).toBe(1);
    expect(wrapper.vm.processedItems[1].x).toBe(0);
  });

  // Additional tests for onDrop, startHoverTimer, moveItem, and any other methods
});
