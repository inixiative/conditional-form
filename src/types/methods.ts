import type { ResourceFormElement, FormElement, FormElementOption } from './models';

export type ResourceFormElementWithElement<T extends string = string> = 
  ResourceFormElement<T> & {
    formElement: FormElement & {
      options: FormElementOption[];
    };
  };

export type ModelWithElements<Model = any, TResource extends string = string> = Model & {
  elements: ResourceFormElementWithElement<TResource>[];
};

export interface ModelGroup<Model = any, TResource extends string = string> {
  label: string;  // e.g., "Game", "Activity Template", "Format"
  key: string;    // e.g., "gameId", "activityTemplateId", "formatId"
  records: ModelWithElements<Model, TResource>[];
}

export interface FormGeneratorInput<TResource extends string = string, Model = any> {
  models: ModelGroup<Model, TResource>[];
}