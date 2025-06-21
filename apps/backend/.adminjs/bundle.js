(function (React) {
  'use strict';

  function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

  var React__default = /*#__PURE__*/_interopDefault(React);

  const CatPhotoThumbnail = props => {
    const {
      record,
      property
    } = props;
    const photoUrl = record?.params?.[property.name];
    if (!photoUrl) return null;
    return /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        margin: '8px 0'
      }
    }, /*#__PURE__*/React__default.default.createElement("a", {
      href: photoUrl,
      target: "_blank",
      rel: "noopener noreferrer"
    }, /*#__PURE__*/React__default.default.createElement("img", {
      src: photoUrl,
      alt: "\u0424\u043E\u0442\u043E \u043A\u043E\u0442\u0430",
      style: {
        maxWidth: '150px',
        maxHeight: '150px',
        borderRadius: '4px',
        border: '1px solid #ddd'
      }
    })));
  };

  AdminJS.UserComponents = {};
  AdminJS.UserComponents.CatPhotoThumbnail = CatPhotoThumbnail;

})(React);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9DYXRQaG90b1RodW1ibmFpbC50c3giLCJlbnRyeS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBCYXNlUHJvcGVydHlQcm9wcyB9IGZyb20gJ2FkbWluanMnO1xyXG5cclxuY29uc3QgQ2F0UGhvdG9UaHVtYm5haWw6IFJlYWN0LkZDPEJhc2VQcm9wZXJ0eVByb3BzPiA9IChwcm9wcykgPT4ge1xyXG4gIGNvbnN0IHsgcmVjb3JkLCBwcm9wZXJ0eSB9ID0gcHJvcHM7XHJcbiAgY29uc3QgcGhvdG9VcmwgPSByZWNvcmQ/LnBhcmFtcz8uW3Byb3BlcnR5Lm5hbWVdO1xyXG5cclxuICBpZiAoIXBob3RvVXJsKSByZXR1cm4gbnVsbDtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17eyBtYXJnaW46ICc4cHggMCcgfX0+XHJcbiAgICAgIDxhIGhyZWY9e3Bob3RvVXJsfSB0YXJnZXQ9XCJfYmxhbmtcIiByZWw9XCJub29wZW5lciBub3JlZmVycmVyXCI+XHJcbiAgICAgICAgPGltZ1xyXG4gICAgICAgICAgc3JjPXtwaG90b1VybH1cclxuICAgICAgICAgIGFsdD1cItCk0L7RgtC+INC60L7RgtCwXCJcclxuICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgIG1heFdpZHRoOiAnMTUwcHgnLFxyXG4gICAgICAgICAgICBtYXhIZWlnaHQ6ICcxNTBweCcsXHJcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzRweCcsXHJcbiAgICAgICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAjZGRkJ1xyXG4gICAgICAgICAgfX1cclxuICAgICAgICAvPlxyXG4gICAgICA8L2E+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgQ2F0UGhvdG9UaHVtYm5haWw7IiwiQWRtaW5KUy5Vc2VyQ29tcG9uZW50cyA9IHt9XG5pbXBvcnQgQ2F0UGhvdG9UaHVtYm5haWwgZnJvbSAnLi4vc3JjL2FkbWluL2NvbXBvbmVudHMvQ2F0UGhvdG9UaHVtYm5haWwnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkNhdFBob3RvVGh1bWJuYWlsID0gQ2F0UGhvdG9UaHVtYm5haWwiXSwibmFtZXMiOlsiQ2F0UGhvdG9UaHVtYm5haWwiLCJwcm9wcyIsInJlY29yZCIsInByb3BlcnR5IiwicGhvdG9VcmwiLCJwYXJhbXMiLCJuYW1lIiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50Iiwic3R5bGUiLCJtYXJnaW4iLCJocmVmIiwidGFyZ2V0IiwicmVsIiwic3JjIiwiYWx0IiwibWF4V2lkdGgiLCJtYXhIZWlnaHQiLCJib3JkZXJSYWRpdXMiLCJib3JkZXIiLCJBZG1pbkpTIiwiVXNlckNvbXBvbmVudHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7RUFHQSxNQUFNQSxpQkFBOEMsR0FBSUMsS0FBSyxJQUFLO0lBQ2hFLE1BQU07TUFBRUMsTUFBTTtFQUFFQyxJQUFBQTtFQUFTLEdBQUMsR0FBR0YsS0FBSztJQUNsQyxNQUFNRyxRQUFRLEdBQUdGLE1BQU0sRUFBRUcsTUFBTSxHQUFHRixRQUFRLENBQUNHLElBQUksQ0FBQztFQUVoRCxFQUFBLElBQUksQ0FBQ0YsUUFBUSxFQUFFLE9BQU8sSUFBSTtJQUMxQixvQkFDRUcsc0JBQUEsQ0FBQUMsYUFBQSxDQUFBLEtBQUEsRUFBQTtFQUFLQyxJQUFBQSxLQUFLLEVBQUU7RUFBRUMsTUFBQUEsTUFBTSxFQUFFO0VBQVE7S0FBRSxlQUM5Qkgsc0JBQUEsQ0FBQUMsYUFBQSxDQUFBLEdBQUEsRUFBQTtFQUFHRyxJQUFBQSxJQUFJLEVBQUVQLFFBQVM7RUFBQ1EsSUFBQUEsTUFBTSxFQUFDLFFBQVE7RUFBQ0MsSUFBQUEsR0FBRyxFQUFDO0tBQXFCLGVBQzFETixzQkFBQSxDQUFBQyxhQUFBLENBQUEsS0FBQSxFQUFBO0VBQ0VNLElBQUFBLEdBQUcsRUFBRVYsUUFBUztFQUNkVyxJQUFBQSxHQUFHLEVBQUMsbURBQVc7RUFDZk4sSUFBQUEsS0FBSyxFQUFFO0VBQ0xPLE1BQUFBLFFBQVEsRUFBRSxPQUFPO0VBQ2pCQyxNQUFBQSxTQUFTLEVBQUUsT0FBTztFQUNsQkMsTUFBQUEsWUFBWSxFQUFFLEtBQUs7RUFDbkJDLE1BQUFBLE1BQU0sRUFBRTtFQUNWO0tBQ0QsQ0FDQSxDQUNBLENBQUM7RUFFVixDQUFDOztFQ3hCREMsT0FBTyxDQUFDQyxjQUFjLEdBQUcsRUFBRTtFQUUzQkQsT0FBTyxDQUFDQyxjQUFjLENBQUNyQixpQkFBaUIsR0FBR0EsaUJBQWlCOzs7Ozs7In0=
