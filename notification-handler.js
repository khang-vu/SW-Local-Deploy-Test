function getNotificationData(payload, translationsMap) {
  let title;
  let options = {
    body: undefined,
    icon: './icons/icon-192.png',
    data: payload,
  };

  let data;
  try {
    data = typeof payload.data === 'string' ? JSON.parse(payload.data) : payload.data || {}
  } catch (e) {
    data = {};
  }

  options.data = data;

  switch (payload.event) {
    case 'settings:edit':
      title = translationsMap.swipedon_employee_approval_rejected_title || '';
      options.body = translationsMap.swipedon_employee_approval_rejected_title || '';

      break;
    case 'movement:edit':
      if (data.reviewStatus === 'allow') {
        title = translationsMap.swipedon_employee_approval_approved_title || '';
        options.body = renderTemplate(translationsMap.swipedon_employee_approval_approved_message, {
          locationName: data.locationName || '',
          startedAt: data.startedAt || '',
        });
      } else {
        title = translationsMap.swipedon_employee_approval_rejected_title || '';
        options.body = renderTemplate(translationsMap.swipedon_employee_approval_rejected_message, data);
      }
      break;
    case 'visit:new':
      title = translationsMap.swipedon_you_have_a_visitor || '';
      if (data.companyName && data.categoryName && data.deviceName) {
        options.body = renderTemplate(translationsMap.swipedon_full_host_notification, {
          fullName: data.fullName || '',
          companyName: data.companyName || '',
          categoryName: data.categoryName || '',
          deviceName: data.deviceName || '',
          locationName: data.locationName || '',
        });
      } else if (data.companyName && data.categoryName) {
        options.body = renderTemplate(translationsMap.swipedon_full_host_notification_no_device, {
          fullName: data.fullName || '',
          companyName: data.companyName || '',
          categoryName: data.categoryName || '',
          locationName: data.locationName || '',
        });
      } else if ((data.companyName && data.deviceName) || (data.categoryName && data.deviceName)) {
        options.body = renderTemplate(translationsMap.swipedon_full_host_notification_no_category_or_company, {
          fullName: data.fullName || '',
          categoryOrCompany: data.companyName || data.categoryName || '',
          deviceName: data.deviceName || '',
          locationName: data.locationName || '',
        });
      } else if (data.companyName || data.categoryName) {
        options.body = renderTemplate(translationsMap.swipedon_full_host_notification_no_device_no_category_or_company, {
          fullName: data.fullName || '',
          categoryOrCompany: data.companyName || data.categoryName || '',
          locationName: data.locationName || '',
        });
      } else if (data.deviceName) {
        options.body = renderTemplate(translationsMap.swipedon_full_host_notification_no_category_and_company, {
          fullName: data.fullName || '',
          deviceName: data.deviceName || '',
          locationName: data.locationName || '',
        });
      } else {
        options.body = renderTemplate(translationsMap.swipedon_full_host_notification_no_device_no_category_and_company, {
          fullName: data.fullName || '',
          locationName: data.locationName || '',
        });
      }
      break;
    case 'delivery:new':
      if (data.signatureRequired) {
        title = translationsMap.swipedon_delivery_with_signature || '';
      } else {
        title = translationsMap.swipedon_delivery_no_signature || '';
      }
      if (data.generalDelivery) {
        if (data.quantity > 1) {
          if (data.signatureRequired) {
            options.body = renderTemplate(translationsMap.swipedon_multiple_general_deliveries_with_signature, {
              quantity: data.quantity,
              locationName: data.locationName || '',
            });
          } else {
            options.body = renderTemplate(translationsMap.swipedon_multiple_general_deliveries_no_signature, {
              quantity: data.quantity,
              locationName: data.locationName || '',
            });
          }
        } else {
          if (data.signatureRequired) {
            options.body = renderTemplate(translationsMap.swipedon_general_delivery_with_signature, {
              locationName: data.locationName || '',
            });
          } else {
            options.body = renderTemplate(translationsMap.swipedon_general_delivery_no_signature, {
              locationName: data.locationName || '',
            });
          }
        }
      } else {
        if (data.cc && data.signatureRequired) {
          options.body = renderTemplate(translationsMap.swipedon_different_assigned_delivery_with_signature, {
            fullName: data.fullName || '',
            locationName: data.locationName || '',
          });
        } else if (data.signatureRequired) {
          options.body = renderTemplate(translationsMap.swipedon_assigned_delivery_with_signature, {
            fullName: data.fullName || '',
            locationName: data.locationName || '',
          });
        } else {
          options.body = renderTemplate(translationsMap.swipedon_assigned_delivery_no_signature, {
            fullName: data.fullName || '',
            locationName: data.locationName || '',
          });
        }
      }
      break;
    case 'spaceBooking:notify':
      title = translationsMap.swipedon_check_in_booking_title || '';
      options.body = renderTemplate(translationsMap.swipedon_check_in_booking_description, {
        resourceName: data.resourceName || '',
      });
      break;
    case 'spaceBooking:new':
    case 'spaceRecurringBooking:new':
      title = translationsMap.swipedon_new_booking_title || '';
      options.body = renderTemplate(translationsMap.swipedon_new_booking_description, {
        categoryName: data.categoryName || '',
        resourceName: data.resourceName || '',
        levelName: data.levelName || '',
        startTime: data.startTime || '',
      });
      break;
    case 'spaceBooking:remove':
    case 'spaceRecurringBooking:remove':
      title = translationsMap.swipedon_cancel_booking_title || '';
      options.body = renderTemplate(translationsMap.swipedon_cancel_booking_description, {
        categoryName: data.categoryName || '',
        startTime: data.startTime || '',
      });
      break;
    case 'spaceBooking:edit':
    case 'spaceRecurringBooking:edit':
      title = translationsMap.swipedon_booking_updated_title || '';
      options.body = renderTemplate(translationsMap.swipedon_booking_updated_description, {
        categoryName: data.categoryName || '',
      });
      break;
    case 'preregistration:new':
      title = translationsMap.swipedon_new_preregistration_title || '';
      if (data.companyName && data.companyName.length > 0) {
        options.body = renderTemplate(translationsMap.swipedon_new_preregistration_description, {
          fullName: data.fullName || '',
          companyName: data.companyName || '',
        });
      } else {
        options.body = renderTemplate(translationsMap.swipedon_new_preregistration_description_no_company, {
          fullName: data.fullName || '',
        });
      }
      break;
    case 'preregistration:edit':
      title = translationsMap.swipedon_updated_preregistration_title || '';
      if (data.companyName && data.companyName.length > 0) {
        options.body = renderTemplate(translationsMap.swipedon_updated_preregistration_description, {
          fullName: data.fullName || '',
          companyName: data.companyName || '',
        });
      } else {
        options.body = renderTemplate(translationsMap.swipedon_updated_preregistration_description_no_company, {
          fullName: data.fullName || '',
        });
      }
      break;
    case 'preregistration:remove':
      title = translationsMap.swipedon_cancelled_preregistration_title || '';
      if (data.companyName && data.companyName.length > 0) {
        options.body = renderTemplate(translationsMap.swipedon_cancelled_preregistration_description, {
          fullName: data.fullName || '',
          companyName: data.companyName || '',
        });
      } else {
        options.body = renderTemplate(translationsMap.swipedon_cancelled_preregistration_description_no_company, {
          fullName: data.fullName || '',
        });
      }
      break;
    default:
      title = payload?.notification?.title || '';
      options.body = payload?.notification?.body || '';
      break;
  }

  return {title, options};
}

function renderTemplate(templateObj, data) {
  if (typeof templateObj === 'string') {
    return templateObj;
  }
  if (!templateObj || !templateObj.template || !templateObj.params) {
    return '';
  }
  let result = templateObj.template;
  for (const param of templateObj.params) {
    const value = data[param] ?? '';
    result = result.replace(`{${param}}`, value);
  }
  return result;
}

// Optionally, export for module usage
if (typeof module !== 'undefined') {
  module.exports = {getNotificationData};
}
