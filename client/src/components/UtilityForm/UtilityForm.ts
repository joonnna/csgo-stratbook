import { Sides } from '@/api/models/Sides';
import { Component, Prop, Emit, Mixins } from 'vue-property-decorator';
import SidePicker from '@/components/SidePicker/SidePicker.vue';
import UtilityPicker from '@/components/UtilityPicker/UtilityPicker.vue';
import BackdropDialog from '@/components/BackdropDialog/BackdropDialog.vue';
import ImageUploader from '@/components/ImageUploader/ImageUploader.vue';
import PosePicker from '@/components/PosePicker/PosePicker.vue';
import FormFieldSet from '@/components/FormFieldSet/FormFieldSet.vue';
import TextInput from '@/components/TextInput/TextInput.vue';
import MouseButtonPicker from '@/components/MouseButtonPicker/MouseButtonPicker.vue';
import { validateForm, Validators } from '@/utils/validation';
import { Utility } from '@/api/models/Utility';
import { UtilityTypes } from '@/api/models/UtilityTypes';
import { MouseButtons } from '@/api/models/MouseButtons';
import { UtilityMovement } from '@/api/models/UtilityMovement';
import FormField from '@/utils/FormField';
import { appModule } from '@/store/namespaces';
import { Toast } from '../ToastWrapper/ToastWrapper.models';
import CloseOnEscape from '@/mixins/CloseOnEscape';

@Component({
  components: {
    SidePicker,
    BackdropDialog,
    TextInput,
    UtilityPicker,
    FormFieldSet,
    ImageUploader,
    MouseButtonPicker,
    PosePicker,
  },
})
export default class UtilityForm extends Mixins(CloseOnEscape) {
  @appModule.Action showToast!: (toast: Toast) => void;
  @Prop() utility!: Utility;
  @Prop() isEdit!: boolean;

  formFields: Record<string, FormField> = {
    name: new FormField('Name', true, [Validators.notEmpty(), Validators.maxLength(50)]),
    description: new FormField('Description', false, [Validators.maxLength(200)]),
    setpos: new FormField('Setpos Command', false, [Validators.maxLength(200)]),
    videoLink: new FormField('Video Link', false, [
      Validators.passAtLeastOne([Validators.isYoutubeLink(), Validators.isCsnadesLink()]),
    ]),
  };

  type: UtilityTypes = UtilityTypes.SMOKE;
  side: Sides = Sides.T;
  mouseButton: MouseButtons = MouseButtons.LEFT;
  crouch = false;
  jump = false;
  movement = UtilityMovement.STILL;
  files: (File | string)[] = [];

  mounted() {
    if (this.utility && this.isEdit) {
      this.mapToFields();
    }
  }

  handleSubmit() {
    if (validateForm(this.formFields)) {
      if (this.files.length || this.formFields.videoLink.value || this.formFields.setpos.value) {
        this.submitUtility();
      } else {
        this.showToast({
          id: 'utilityForm/noMedia',
          text: 'You need to add either an image, a videolink or a setpos command.',
        });
      }
    }
  }

  @Emit()
  submitUtility(): FormData {
    const requestFormData = new FormData();

    const filesToDelete: string[] = [];

    this.utility?.images.forEach((image) => {
      if (!this.files.find((file) => file === image)) {
        filesToDelete.push(image);
      }
    });

    if (filesToDelete.length) {
      requestFormData.append('delete', JSON.stringify(filesToDelete));
    }

    this.files.forEach((file) => {
      if (typeof file !== 'string') {
        requestFormData.append('images', file, file.name);
      }
    });

    for (const [key, data] of Object.entries(this.formFields)) {
      requestFormData.append(key, data.value);
    }

    if (this.isEdit) requestFormData.append('_id', this.utility._id);

    requestFormData.append('type', this.type);
    requestFormData.append('side', this.side);
    requestFormData.append('mouseButton', this.mouseButton);
    requestFormData.append('crouch', JSON.stringify(this.crouch));
    requestFormData.append('jump', JSON.stringify(this.jump));
    requestFormData.append('movement', this.movement);

    return requestFormData;
  }

  mapToFields() {
    this.formFields.name.value = this.utility.name;
    this.formFields.description.value = this.utility.description ?? '';
    this.formFields.videoLink.value = this.utility.videoLink ?? '';
    this.formFields.setpos.value = this.utility.setpos ?? '';
    this.type = this.utility.type;
    this.side = this.utility.side;
    this.mouseButton = this.utility.mouseButton;
    this.crouch = this.utility.crouch;
    this.jump = this.utility.jump;
    this.movement = this.utility.movement;
    this.files = [...this.utility.images];
  }

  toggleCrouch() {
    this.crouch = !this.crouch;
  }

  toggleJump() {
    this.jump = !this.jump;
  }

  toggleMovement() {
    switch (this.movement) {
      case UtilityMovement.STILL:
        this.movement = UtilityMovement.WALK;
        break;
      case UtilityMovement.WALK:
        this.movement = UtilityMovement.RUN;
        break;
      case UtilityMovement.RUN:
        this.movement = UtilityMovement.STILL;
        break;
    }
  }
}
