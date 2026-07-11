<script setup lang="ts">
  import { ref } from 'vue'
  import { useForm, Field } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import { z } from 'zod'

  definePage({
    path: '/docs/form-showcase',
    name: 'FormShowcase',
    meta: {
      breadcrumbs: [{ label: 'Docs' }, { label: 'Form Showcase' }],
    },
  })
  import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
  import { TextField, TextAreaField } from '@/components/ui/form'
  import { DatePickerField } from '@/components/ui/date-picker'
  import { TimePickerField } from '@/components/ui/time-picker'
  import {
    RichEditorField,
    ImageUploaderField,
    SearchableSelectField,
    MultiSelectField,
    TagInputField,
    SelectOptionField,
  } from '@/components/ui'
  import type { ComboboxOption } from '@/components/ui'
  import { Button } from '@/components/ui/button'
  import { Checkbox } from '@/components/ui/checkbox'
  import { Switch } from '@/components/ui/switch'
  import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
  import { DialogWrapper } from '@/components/ui/dialog'
  import { Mail, Phone, User } from 'lucide-vue-next'

  const isSubmitting = ref(false)
  const showDialog = ref(false)
  const dialogRef = ref()

  const singleImage = ref<(File | string)[]>([])

  const multipleImages = ref<(File | string)[]>([
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop',
  ])

  const countryOptions: ComboboxOption<string>[] = [
    { value: 'id', label: 'Indonesia', description: 'Southeast Asia' },
    { value: 'us', label: 'United States', description: 'North America' },
    { value: 'uk', label: 'United Kingdom', description: 'Europe' },
    { value: 'sg', label: 'Singapore', description: 'Southeast Asia' },
    { value: 'jp', label: 'Japan', description: 'East Asia' },
    { value: 'au', label: 'Australia', description: 'Oceania' },
    { value: 'de', label: 'Germany', description: 'Europe' },
    { value: 'fr', label: 'France', description: 'Europe' },
  ]

  const statusOptions: ComboboxOption<string>[] = [
    { value: 'active', label: 'Active', badge: { label: 'Active', variant: 'success' } },
    { value: 'pending', label: 'Pending Review', badge: { label: 'Pending', variant: 'warning' } },
    { value: 'inactive', label: 'Inactive', badge: { label: 'Inactive', variant: 'neutral' } },
    { value: 'suspended', label: 'Suspended', badge: { label: 'Suspended', variant: 'error' } },
  ]

  const skillOptions: ComboboxOption<string>[] = [
    { value: 'vue', label: 'Vue.js', badge: { label: 'Frontend', variant: 'info' } },
    { value: 'react', label: 'React', badge: { label: 'Frontend', variant: 'info' } },
    { value: 'angular', label: 'Angular', badge: { label: 'Frontend', variant: 'info' } },
    { value: 'node', label: 'Node.js', badge: { label: 'Backend', variant: 'success' } },
    { value: 'python', label: 'Python', badge: { label: 'Backend', variant: 'success' } },
    { value: 'go', label: 'Go', badge: { label: 'Backend', variant: 'success' } },
    { value: 'typescript', label: 'TypeScript', badge: { label: 'Language', variant: 'neutral' } },
    { value: 'rust', label: 'Rust', badge: { label: 'Language', variant: 'neutral' } },
  ]

  const departmentGroups = [
    {
      id: 'engineering',
      label: 'Engineering',
      options: [
        { value: 'frontend', label: 'Frontend Developer' },
        { value: 'backend', label: 'Backend Developer' },
        { value: 'fullstack', label: 'Fullstack Developer' },
        { value: 'devops', label: 'DevOps Engineer' },
      ] as ComboboxOption<string>[],
    },
    {
      id: 'design',
      label: 'Design',
      options: [
        { value: 'ui', label: 'UI Designer' },
        { value: 'ux', label: 'UX Designer' },
        { value: 'product', label: 'Product Designer' },
      ] as ComboboxOption<string>[],
    },
    {
      id: 'management',
      label: 'Management',
      options: [
        { value: 'pm', label: 'Product Manager' },
        { value: 'em', label: 'Engineering Manager' },
        { value: 'lead', label: 'Tech Lead' },
      ] as ComboboxOption<string>[],
    },
  ]

  const priorityOptions: ComboboxOption<string>[] = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' },
  ]

  const categoryGroups = [
    {
      id: 'work',
      label: 'Work Related',
      options: [
        { value: 'task', label: 'Task' },
        { value: 'project', label: 'Project' },
        { value: 'meeting', label: 'Meeting' },
      ] as ComboboxOption<string>[],
    },
    {
      id: 'personal',
      label: 'Personal',
      options: [
        { value: 'health', label: 'Health & Wellness' },
        { value: 'finance', label: 'Finance' },
        { value: 'education', label: 'Education' },
      ] as ComboboxOption<string>[],
    },
  ]

  const formSchema = z.object({
    fullName: z
      .string()
      .min(1, 'Full name is required')
      .min(3, 'Full name must be at least 3 characters'),
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
    phone: z
      .string()
      .regex(/^\+?[\d\s-]+$/, 'Please enter a valid phone number')
      .optional()
      .or(z.literal('')),
    company: z.string().optional(),
    position: z.string().optional(),
    salary: z.string().optional(),
    discount: z.string().optional(),
    weight: z.string().optional(),
    distance: z.string().optional(),
    duration: z.string().optional(),
    ticketQty: z.string().optional(),
    productQty: z.string().optional(),
    unitQty: z.string().optional(),
    country: z.string().min(1, 'Country is required'),
    status: z.string().min(1, 'Status is required'),
    department: z.string().optional(),
    skills: z.array(z.string()).min(1, 'Please select at least one skill'),
    tags: z.array(z.string()).min(1, 'Please add at least one tag'),
    priority: z.string().min(1, 'Priority is required'),
    category: z.string().optional(),
    date: z.any().refine(val => val !== undefined, { message: 'Date is required' }),
    time: z.string().min(1, 'Time is required'),
    description: z.string().optional(),
    richDescription: z.string().optional(),
    agreeToTerms: z
      .boolean()
      .refine(val => val === true, 'You must agree to the terms and conditions'),
    emailNotifications: z.boolean(),
    smsNotifications: z.boolean(),
    accountType: z.enum(['personal', 'business', 'enterprise']),
    subscriptionPlan: z.enum(['free', 'pro', 'premium']),
  })

  type FormValues = z.infer<typeof formSchema>

  const { handleSubmit, values, resetForm } = useForm<FormValues>({
    validationSchema: toTypedSchema(formSchema),
    initialValues: {
      fullName: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      salary: '',
      discount: '',
      weight: '',
      distance: '',
      duration: '',
      ticketQty: '',
      productQty: '',
      unitQty: '',
      country: '',
      status: '',
      department: '',
      skills: [],
      tags: [],
      priority: '',
      category: '',
      date: undefined,
      time: '',
      description: '',
      richDescription: '',
      agreeToTerms: false,
      emailNotifications: true,
      smsNotifications: false,
      accountType: 'personal',
      subscriptionPlan: 'free',
    },
  })

  const onSubmit = handleSubmit(async formValues => {
    isSubmitting.value = true

    await new Promise(resolve => setTimeout(resolve, 1500))

    alert('Form submitted successfully!')
    // eslint-disable-next-line no-console
    console.log('Form data:', formValues)

    isSubmitting.value = false
  })

  const handleReset = () => {
    resetForm()
  }

  const handleDialogSubmit = () => {
    alert('Dialog submitted!')
    showDialog.value = false
  }
</script>

<template>
  <div class="max-w-4xl space-y-6">
    <div>
      <h1 class="heading-l text-foreground">Form Components</h1>
      <p class="body-m text-muted-foreground mt-1">
        Comprehensive form demonstration with vee-validate + zod validation
      </p>

      <div class="mt-4 flex gap-2">
        <Button variant="secondary" size="sm" @click="showDialog = true"> Open Dialog Demo </Button>
        <Button variant="tertiary" size="sm" @click="dialogRef?.show()">
          Open Dialog (via ref)
        </Button>
      </div>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>User Registration Form</CardTitle>
        <CardDescription>
          Fill out the form below to create a new account. All fields marked with * are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit="onSubmit" class="space-y-6">
          <div class="space-y-4">
            <h3 class="body-l-medium text-foreground">Personal Information</h3>

            <Field name="fullName" v-slot="{ field, meta: fieldMeta, errorMessage }">
              <TextField
                :model-value="field.value"
                label="Full Name"
                placeholder="Enter your full name"
                :prefix-icon="User"
                required
                :error="fieldMeta.touched && errorMessage ? errorMessage : undefined"
                @update:model-value="field.onChange"
                @blur="field.onBlur"
              />
            </Field>

            <Field name="email" v-slot="{ field, meta: fieldMeta, errorMessage }">
              <TextField
                :model-value="field.value"
                label="Email Address"
                type="email"
                placeholder="example@email.com"
                :prefix-icon="Mail"
                required
                :error="fieldMeta.touched && errorMessage ? errorMessage : undefined"
                helper="We'll never share your email with anyone else."
                @update:model-value="field.onChange"
                @blur="field.onBlur"
              />
            </Field>

            <Field name="phone" v-slot="{ field, meta: fieldMeta, errorMessage }">
              <TextField
                :model-value="field.value"
                label="Phone Number"
                type="tel"
                placeholder="+62 812 3456 7890"
                :prefix-icon="Phone"
                :error="fieldMeta.touched && errorMessage ? errorMessage : undefined"
                helper="Optional: For account recovery"
                @update:model-value="field.onChange"
                @blur="field.onBlur"
              />
            </Field>
          </div>

          <div class="space-y-4">
            <h3 class="body-l-medium text-foreground">Professional Information</h3>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field name="company" v-slot="{ field }">
                <TextField
                  :model-value="field.value"
                  label="Company"
                  placeholder="Your company name"
                  @update:model-value="field.onChange"
                  @blur="field.onBlur"
                />
              </Field>

              <Field name="position" v-slot="{ field }">
                <TextField
                  :model-value="field.value"
                  label="Position"
                  placeholder="Your job title"
                  @update:model-value="field.onChange"
                  @blur="field.onBlur"
                />
              </Field>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="body-l-medium text-foreground">Format Examples (Prefix/Suffix Demo)</h3>
            <p class="body-s text-muted-foreground">
              Demonstrating the new format feature with predefined formats like currency,
              percentage, weight, distance, and duration.
            </p>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field name="salary" v-slot="{ field }">
                <TextField
                  :model-value="field.value"
                  label="Expected Salary"
                  placeholder="0"
                  type="number"
                  format="currency"
                  helper="Using format='currency' (Rp prefix)"
                  @update:model-value="field.onChange"
                  @blur="field.onBlur"
                />
              </Field>

              <Field name="discount" v-slot="{ field }">
                <TextField
                  :model-value="field.value"
                  label="Discount Rate"
                  placeholder="0"
                  type="number"
                  format="percentage"
                  helper="Using format='percentage' (% suffix)"
                  @update:model-value="field.onChange"
                  @blur="field.onBlur"
                />
              </Field>

              <Field name="weight" v-slot="{ field }">
                <TextField
                  :model-value="field.value"
                  label="Package Weight"
                  placeholder="0"
                  type="number"
                  format="kg"
                  helper="Using format='kg' (kg suffix)"
                  @update:model-value="field.onChange"
                  @blur="field.onBlur"
                />
              </Field>

              <Field name="distance" v-slot="{ field }">
                <TextField
                  :model-value="field.value"
                  label="Distance"
                  placeholder="0"
                  type="number"
                  format="km"
                  helper="Using format='km' (km suffix)"
                  @update:model-value="field.onChange"
                  @blur="field.onBlur"
                />
              </Field>

              <Field name="duration" v-slot="{ field }">
                <TextField
                  :model-value="field.value"
                  label="Duration"
                  placeholder="0"
                  type="number"
                  format="hours"
                  helper="Using format='hours' (jam suffix)"
                  @update:model-value="field.onChange"
                  @blur="field.onBlur"
                />
              </Field>
            </div>

            <p class="body-s text-muted-foreground">
              More built-in formats available (tiket, pcs, unit, box, orang, item, liter, ml, gram,
              cm, detik, etc.):
            </p>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Field name="ticketQty" v-slot="{ field }">
                <TextField
                  :model-value="field.value"
                  label="Ticket Quantity"
                  placeholder="0"
                  type="number"
                  format="tiket"
                  helper="format='tiket'"
                  @update:model-value="field.onChange"
                  @blur="field.onBlur"
                />
              </Field>

              <Field name="productQty" v-slot="{ field }">
                <TextField
                  :model-value="field.value"
                  label="Product Quantity"
                  placeholder="0"
                  type="number"
                  format="pcs"
                  helper="format='pcs'"
                  @update:model-value="field.onChange"
                  @blur="field.onBlur"
                />
              </Field>

              <Field name="unitQty" v-slot="{ field }">
                <TextField
                  :model-value="field.value"
                  label="Unit Quantity"
                  placeholder="0"
                  type="number"
                  format="unit"
                  helper="format='unit'"
                  @update:model-value="field.onChange"
                  @blur="field.onBlur"
                />
              </Field>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="body-l-medium text-foreground">Dropdown Components</h3>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field name="country" v-slot="{ field, meta: fieldMeta, errorMessage }">
                <SearchableSelectField
                  :model-value="field.value"
                  :options="countryOptions"
                  label="Country"
                  placeholder="Select country..."
                  search-placeholder="Search country..."
                  required
                  :error="fieldMeta.touched && errorMessage ? errorMessage : undefined"
                  helper="Select your country of residence"
                  @update:model-value="field.onChange"
                />
              </Field>

              <Field name="status" v-slot="{ field, meta: fieldMeta, errorMessage }">
                <SearchableSelectField
                  :model-value="field.value"
                  :options="statusOptions"
                  label="Account Status"
                  placeholder="Select status..."
                  required
                  :error="fieldMeta.touched && errorMessage ? errorMessage : undefined"
                  helper="Select your account status"
                  @update:model-value="field.onChange"
                />
              </Field>
            </div>

            <Field name="department" v-slot="{ field }">
              <SearchableSelectField
                :model-value="field.value"
                :groups="departmentGroups"
                label="Department"
                placeholder="Select department..."
                search-placeholder="Search department..."
                helper="Select your department (grouped options)"
                @update:model-value="field.onChange"
              />
            </Field>

            <Field name="skills" v-slot="{ field, meta: fieldMeta, errorMessage }">
              <MultiSelectField
                :model-value="field.value"
                :options="skillOptions"
                label="Skills"
                placeholder="Select skills..."
                search-placeholder="Search skills..."
                :max-displayed-badges="4"
                required
                :error="fieldMeta.touched && errorMessage ? errorMessage : undefined"
                helper="Select your technical skills (multiple selection)"
                @update:model-value="field.onChange"
              />
            </Field>

            <Field name="tags" v-slot="{ field, meta: fieldMeta, errorMessage }">
              <TagInputField
                :model-value="field.value"
                label="Custom Tags"
                placeholder="Ketik tag dan tekan Enter..."
                required
                :max-tags="10"
                :error="fieldMeta.touched && errorMessage ? errorMessage : undefined"
                helper="Add custom tags (max 10). Press Enter or comma to add. Duplicates not allowed."
                variant="default"
                @update:model-value="field.onChange"
              />
            </Field>

            <Field name="priority" v-slot="{ field, meta: fieldMeta, errorMessage }">
              <SelectOptionField
                :model-value="field.value"
                :options="priorityOptions"
                label="Priority Level"
                placeholder="Select priority..."
                required
                :error="fieldMeta.touched && errorMessage ? errorMessage : undefined"
                helper="Choose task priority using native select (flat options)"
                @update:model-value="field.onChange"
              />
            </Field>

            <Field name="category" v-slot="{ field }">
              <SelectOptionField
                :model-value="field.value"
                :groups="categoryGroups"
                label="Category"
                placeholder="Select category..."
                helper="Choose category using native select (grouped options)"
                @update:model-value="field.onChange"
              />
            </Field>
          </div>

          <div class="space-y-4">
            <h3 class="body-l-medium text-foreground">Schedule Information</h3>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field name="date" v-slot="{ field, meta: fieldMeta, errorMessage }">
                <DatePickerField
                  :model-value="field.value"
                  label="Preferred Date"
                  required
                  :error="fieldMeta.touched && errorMessage ? errorMessage : undefined"
                  helper="Select your preferred date"
                  @update:model-value="field.onChange"
                />
              </Field>

              <Field name="time" v-slot="{ field, meta: fieldMeta, errorMessage }">
                <TimePickerField
                  :model-value="field.value"
                  label="Preferred Time"
                  required
                  :error="fieldMeta.touched && errorMessage ? errorMessage : undefined"
                  helper="Select your preferred time"
                  @update:model-value="field.onChange"
                  @blur="field.onBlur"
                />
              </Field>
            </div>
          </div>

          <Field name="accountType" v-slot="{ field }">
            <div class="space-y-3">
              <label class="body-m-medium text-foreground">
                Account Type <span class="text-error-500">*</span>
              </label>
              <RadioGroup :model-value="field.value" @update:model-value="field.onChange">
                <div class="flex items-center space-x-2">
                  <RadioGroupItem value="personal" id="personal" />
                  <label for="personal" class="body-m flex-1 cursor-pointer">
                    <div>
                      <p class="body-m-medium">Personal Account</p>
                      <p class="body-s text-muted-foreground">For individual use</p>
                    </div>
                  </label>
                </div>

                <div class="flex items-center space-x-2">
                  <RadioGroupItem value="business" id="business" />
                  <label for="business" class="body-m flex-1 cursor-pointer">
                    <div>
                      <p class="body-m-medium">Business Account</p>
                      <p class="body-s text-muted-foreground">For teams and organizations</p>
                    </div>
                  </label>
                </div>

                <div class="flex items-center space-x-2">
                  <RadioGroupItem value="enterprise" id="enterprise" />
                  <label for="enterprise" class="body-m flex-1 cursor-pointer">
                    <div>
                      <p class="body-m-medium">Enterprise Account</p>
                      <p class="body-s text-muted-foreground">For large organizations</p>
                    </div>
                  </label>
                </div>
              </RadioGroup>
            </div>
          </Field>

          <Field name="subscriptionPlan" v-slot="{ field }">
            <div class="space-y-3">
              <label class="body-m-medium text-foreground">Subscription Plan</label>
              <RadioGroup :model-value="field.value" @update:model-value="field.onChange">
                <div class="flex items-center space-x-2">
                  <RadioGroupItem value="free" id="free" />
                  <label for="free" class="body-m flex-1 cursor-pointer"> Free - $0/month </label>
                </div>

                <div class="flex items-center space-x-2">
                  <RadioGroupItem value="pro" id="pro" />
                  <label for="pro" class="body-m flex-1 cursor-pointer"> Pro - $19/month </label>
                </div>

                <div class="flex items-center space-x-2">
                  <RadioGroupItem value="premium" id="premium" />
                  <label for="premium" class="body-m flex-1 cursor-pointer">
                    Premium - $49/month
                  </label>
                </div>
              </RadioGroup>
            </div>
          </Field>

          <Field name="description" v-slot="{ field }">
            <TextAreaField
              :model-value="field.value"
              label="Additional Information"
              placeholder="Tell us more about yourself or your requirements..."
              :rows="5"
              helper="Optional: Any additional details you'd like to share"
              @update:model-value="field.onChange"
              @blur="field.onBlur"
            />
          </Field>

          <Field name="richDescription" v-slot="{ field, meta: fieldMeta, errorMessage }">
            <RichEditorField
              :model-value="field.value"
              label="Detailed Description (Rich Text)"
              placeholder="Write a detailed description with formatting..."
              content-type="html"
              :show-character-count="true"
              :max-length="5000"
              :error="fieldMeta.touched && errorMessage ? errorMessage : undefined"
              helper="You can use rich formatting including bold, italic, lists, and links"
              @update:model-value="field.onChange"
              @blur="field.onBlur"
            />
          </Field>

          <div class="space-y-4">
            <h3 class="body-l-medium text-foreground">Image Upload</h3>

            <ImageUploaderField
              v-model="singleImage"
              label="Profile Picture"
              helper="Upload a single profile picture"
              :multiple="false"
              :show-reupload="true"
              :show-alert="true"
              alert-variant="info"
              alert-title="Image Requirements"
              alert-description="Please upload a square image (1:1 ratio) with minimum dimensions of 400x400px. Supported formats: JPG, PNG, WebP. Max file size: 2MB."
            />

            <ImageUploaderField
              v-model="multipleImages"
              label="Portfolio Images (Edit Mode Demo)"
              helper="This simulates edit mode with existing images from server (URLs). You can add new images (Files), remove, or re-upload existing ones. Max 10 images."
              :multiple="true"
              :max-files="10"
              :show-reupload="true"
            >
              <template #alert>
                <div class="space-y-1">
                  <p class="body-m-medium">Portfolio Requirements</p>
                  <ul class="body-s list-inside list-disc space-y-0.5">
                    <li>Recommended dimensions: 1200x800px (3:2 ratio)</li>
                    <li>Supported formats: JPG, PNG, WebP</li>
                    <li>Maximum file size: 5MB per image</li>
                  </ul>
                </div>
              </template>
            </ImageUploaderField>
          </div>

          <div class="space-y-4">
            <h3 class="body-l-medium text-foreground">Notification Preferences</h3>

            <Field name="emailNotifications" v-slot="{ field }">
              <div class="flex items-center justify-between space-x-4">
                <div class="flex-1">
                  <label for="email-notif" class="body-m-medium text-foreground cursor-pointer">
                    Email Notifications
                  </label>
                  <p class="body-s text-muted-foreground">
                    Receive email updates about your account activity
                  </p>
                </div>
                <Switch id="email-notif" :checked="field.value" @update:checked="field.onChange" />
              </div>
            </Field>

            <Field name="smsNotifications" v-slot="{ field }">
              <div class="flex items-center justify-between space-x-4">
                <div class="flex-1">
                  <label for="sms-notif" class="body-m-medium text-foreground cursor-pointer">
                    SMS Notifications
                  </label>
                  <p class="body-s text-muted-foreground">
                    Receive text messages for important updates
                  </p>
                </div>
                <Switch id="sms-notif" :checked="field.value" @update:checked="field.onChange" />
              </div>
            </Field>
          </div>

          <Field name="agreeToTerms" v-slot="{ field, meta: fieldMeta, errorMessage }">
            <div class="space-y-1">
              <div class="flex items-start space-x-2 pt-2">
                <Checkbox
                  id="terms"
                  :checked="field.value"
                  @update:checked="field.onChange"
                  class="mt-0.5"
                />
                <label for="terms" class="body-m text-foreground cursor-pointer leading-tight">
                  I agree to the
                  <a href="#" class="text-primary-600 hover:underline">Terms of Service</a>
                  and
                  <a href="#" class="text-primary-600 hover:underline">Privacy Policy</a>
                </label>
              </div>
              <p v-if="fieldMeta.touched && errorMessage" class="body-s text-error-500 ml-6">
                {{ errorMessage }}
              </p>
            </div>
          </Field>

          <div class="flex flex-col gap-3 border-t pt-4 sm:flex-row">
            <Button
              type="submit"
              variant="primary"
              size="md"
              :loading="isSubmitting"
              class="flex-1 sm:flex-none"
            >
              Submit Application
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="md"
              @click="handleReset"
              :disabled="isSubmitting"
              class="flex-1 sm:flex-none"
            >
              Reset Form
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>

    <Card class="border-primary-200 bg-primary-50">
      <CardHeader>
        <CardTitle class="body-l-medium text-primary-800">Form Data Preview</CardTitle>
        <CardDescription class="text-primary-600">
          This is for development purposes only - shows current form values
        </CardDescription>
      </CardHeader>
      <CardContent>
        <pre class="text-primary-800 overflow-auto text-xs">{{ values }}</pre>
      </CardContent>
    </Card>

    <DialogWrapper
      ref="dialogRef"
      v-model:open="showDialog"
      title="User Profile Settings"
      size="md"
    >
      <p class="body-m text-foreground">
        This is a demonstration of the DialogWrapper component with all features enabled.
      </p>

      <div class="space-y-4">
        <TextField label="Username" placeholder="Enter username" helper="Your unique username" />

        <TextField
          type="email"
          label="Email"
          placeholder="Enter email"
          helper="We'll never share your email"
        />

        <TextAreaField
          label="Bio"
          placeholder="Tell us about yourself..."
          :rows="4"
          helper="Maximum 500 characters"
        />
      </div>

      <template #footer>
        <Button variant="secondary" @click="showDialog = false"> Cancel </Button>
        <Button variant="primary" @click="handleDialogSubmit"> Save Changes </Button>
      </template>
    </DialogWrapper>
  </div>
</template>
