# Feature Verification Guide

This guide will help you verify that all three new features are working correctly.

## Prerequisites

1. Make sure the development server is running:
   ```bash
   npm run dev
   ```

2. Open the application in your browser at `http://localhost:3000`

3. Have an API key ready (Alpha Vantage or Finnhub) - you can get a free one from:
   - Alpha Vantage: https://www.alphavantage.co/support/#api-key
   - Finnhub: https://finnhub.io/

---

## Feature 1: Candlestick Charts ✅

### Step-by-Step Verification

1. **Add a Chart Widget**
   - Click the "Add Widget" button in the header
   - Select "Chart" as the widget type
   - Enter a title (e.g., "Stock Chart")
   - (Optional) Add your API key
   - Click "Add Widget"

2. **Configure for Candlestick**
   - Hover over the chart widget
   - Click the settings icon (⚙️)
   - In the configuration panel:
     - Set "Chart Type" to "Candlestick Chart"
     - Set "Time Interval" to "Daily" (or Weekly/Monthly)
   - Click "Save Changes"

3. **Verify Candlestick Display**
   - ✅ You should see candlestick shapes instead of lines
   - ✅ Green candles = price went up (close >= open)
   - ✅ Red candles = price went down (close < open)
   - ✅ Each candle shows: High (top wick), Low (bottom wick), Open/Close (body)
   - ✅ A "Candlestick" badge appears in the chart controls

4. **Test Switching Between Chart Types**
   - Open widget configuration again
   - Switch between "Line Chart" and "Candlestick Chart"
   - ✅ Chart should update immediately

### Expected Behavior
- Candlestick chart displays OHLC data visually
- Colors correctly indicate up/down movements
- Chart is responsive and readable
- Can toggle between line and candlestick views

---

## Feature 2: Advanced Filtering Options ✅

### Step-by-Step Verification

1. **Add a Table Widget**
   - Click "Add Widget"
   - Select "Table" as widget type
   - Enter a title (e.g., "Stock Data")
   - Click "Add Widget"

2. **Wait for Data to Load**
   - The table should populate with data (may take a few seconds)
   - If no data appears, configure the widget with an API key

3. **Test Global Search**
   - ✅ Type in the search box at the top
   - ✅ Table should filter rows that match your search across all columns
   - ✅ Clear search to see all data again

4. **Test Column Sorting**
   - ✅ Click any column header
   - ✅ First click: Sort ascending (↑ arrow appears)
   - ✅ Second click: Sort descending (↓ arrow appears)
   - ✅ Third click: Remove sort (no arrow)
   - ✅ Data should reorder immediately

5. **Test Column Filters**
   - Click the "Filters" button
   - ✅ Filter panel should expand
   - ✅ You should see input fields for each column
   - Type in any column filter field
   - ✅ Table should filter to show only matching rows
   - ✅ Multiple column filters work together (AND logic)

6. **Test Clear Filters**
   - Apply some filters and sorting
   - Click "Clear" button
   - ✅ All filters, sorting, and search should reset
   - ✅ Table should show all original data

7. **Test Filter Panel Toggle**
   - Click "Filters" button again
   - ✅ Panel should collapse
   - ✅ Active filters remain applied (indicated by border highlight)

### Expected Behavior
- Search works across all visible columns
- Column headers are clickable and show sort indicators
- Filter panel expands/collapses smoothly
- Multiple filters combine correctly
- Clear button resets everything
- Active filters are visually indicated

---

## Feature 3: Widget Resizing ✅

### Step-by-Step Verification

1. **Add Any Widget**
   - Add a widget (Table, Card, or Chart)
   - Wait for it to render

2. **Locate Resize Handles**
   - Hover over the widget
   - ✅ You should see 8 resize handles appear:
     - 4 corner handles (diagonal resize)
     - 4 edge handles (horizontal/vertical resize)
   - Handles appear on hover (semi-transparent)

3. **Test Corner Resizing**
   - Hover over a corner (e.g., bottom-right)
   - Cursor should change to resize cursor (↘ or ↙)
   - Click and drag the corner
   - ✅ Widget should resize in both width and height
   - ✅ Minimum size enforced (300px width, 250px height)

4. **Test Edge Resizing**
   - Hover over an edge (top, bottom, left, right)
   - Cursor should change to appropriate resize cursor
   - Click and drag the edge
   - ✅ Widget should resize in one direction only
   - ✅ Minimum size enforced

5. **Test Size Persistence**
   - Resize a widget
   - Refresh the page (F5)
   - ✅ Widget should maintain its size after refresh
   - ✅ Size is saved to localStorage

6. **Test Reset Size**
   - Resize a widget to a custom size
   - Hover over the widget
   - Click the maximize icon (⛶) next to settings
   - ✅ Widget should return to default size
   - ✅ Width and height constraints removed

7. **Test Multiple Widgets**
   - Add multiple widgets
   - Resize each one independently
   - ✅ Each widget maintains its own size
   - ✅ Resizing one doesn't affect others

8. **Test During Drag**
   - Try dragging a widget (using the grip icon)
   - ✅ Resize handles should not interfere with drag
   - ✅ Both features work independently

### Expected Behavior
- 8 resize handles appear on hover
- Smooth resizing while dragging
- Minimum size constraints prevent too-small widgets
- Size persists across page refreshes
- Reset button restores default size
- Multiple widgets can have different sizes
- Resize doesn't interfere with drag-and-drop

---

## Quick Verification Checklist

### Candlestick Charts
- [ ] Can create a chart widget
- [ ] Can switch to candlestick view
- [ ] Candles show correct colors (green up, red down)
- [ ] Chart displays OHLC data correctly
- [ ] Can switch back to line chart

### Advanced Filtering
- [ ] Search box filters data
- [ ] Column headers are clickable for sorting
- [ ] Sort direction changes on click
- [ ] Filter panel expands/collapses
- [ ] Column filters work independently
- [ ] Multiple filters combine correctly
- [ ] Clear button resets everything
- [ ] Active filters are highlighted

### Widget Resizing
- [ ] Resize handles appear on hover
- [ ] Can resize from corners (diagonal)
- [ ] Can resize from edges (one direction)
- [ ] Minimum size is enforced
- [ ] Size persists after page refresh
- [ ] Reset button works
- [ ] Multiple widgets can have different sizes
- [ ] Resize doesn't interfere with drag

---

## Troubleshooting

### If Candlestick Chart Doesn't Show
- Make sure you selected "Candlestick Chart" in configuration
- Check that the API is returning OHLC data (open, high, low, close)
- Try a different stock symbol (e.g., AAPL, MSFT, GOOGL)

### If Filtering Doesn't Work
- Make sure data has loaded (check for loading spinner)
- Verify that the table has data rows
- Check browser console for errors
- Try refreshing the page

### If Resizing Doesn't Work
- Make sure you're hovering over the widget (not dragging)
- Check that you're clicking on the resize handles (corners/edges)
- Verify the cursor changes to a resize cursor
- Try a different browser if issues persist

### General Issues
- Clear browser cache and localStorage
- Check browser console for errors (F12)
- Verify all dependencies are installed: `npm install`
- Restart the development server

---

## Success Criteria

All features are working correctly if:
1. ✅ Candlestick charts display with proper colors and OHLC data
2. ✅ Table filtering, sorting, and search all function correctly
3. ✅ Widgets can be resized smoothly and sizes persist
4. ✅ No console errors appear
5. ✅ All features work together without conflicts

---

## Next Steps

Once verified, you can:
- Customize widget sizes for your dashboard layout
- Use advanced filters to analyze specific data
- Switch between chart types based on your analysis needs
- Export your dashboard configuration with all customizations

