import { Alertable } from './alertable'

export function handleError(component: Alertable, err: any) {
  if (err.status == 404) {
    component.showAlert("Not found");
  } else {
    component.showAlert("Unexpected error occurred, please try again later.")
  }
}
