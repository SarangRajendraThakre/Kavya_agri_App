     
     
     
     <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -200} // Adjust offset as needed for Android
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {/* Profile Image and Camera Icon */}
          <View style={styles.profileImageContainer}>
            <Image source={profileImage} style={styles.profileImage} />
            <TouchableOpacity
              onPress={handleImageChange}
              style={[styles.cameraIcon, !isEditMode && styles.disabledCameraIcon]} // Apply disabled style
              disabled={!isEditMode}
            >
              <Text style={styles.cameraText}>📸</Text>
            </TouchableOpacity>
          </View>

          {/* Form section with TextInputs and Dropdowns */}
          <View style={styles.form}>
            {/* Salutation */}
            <FieldRenderer label="Salutation" value={salutation} editable={isEditMode}>
              <DropdownComponent
                data={salutationOptions}
                placeholder="Select Salutation"
                value={salutation}
                onSelect={setSalutation}
                icon="account-circle-outline"
                searchable={false}
                disabled={!isEditMode} // Disable dropdown when not in edit mode
                inputContainerStyle={!isEditMode && styles.disabledInput}
              />
            </FieldRenderer>

            {/* First Name and Last Name side-by-side (Corrected structure) */}
            <View style={styles.nameInputContainer}>
              {/* First Name */}
              <View style={styles.halfInputContainer}>
                <Text style={styles.label}>First Name</Text>
                {isEditMode ? (
                  <CustomTextInput
                    iconLeft="account-outline"
                    placeholder="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                    editable={isEditMode}
                    inputStyle={!isEditMode && styles.disabledInput}
                  />
                ) : (
                  <Text style={styles.valueText}>{firstName || 'N/A'}</Text>
                )}
              </View>

              {/* Last Name */}
              <View style={styles.halfInputContainer}>
                <Text style={styles.label}>Last Name</Text>
                {isEditMode ? (
                  <CustomTextInput
                    iconLeft="account-outline"
                    placeholder="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                    editable={isEditMode}
                    inputStyle={!isEditMode && styles.disabledInput}
                  />
                ) : (
                  <Text style={styles.valueText}>{lastName || 'N/A'}</Text>
                )}
              </View>
            </View>

            {/* Mobile No */}
            <FieldRenderer label="Mobile Number" value={mobileNo} editable={isEditMode}>
              <CustomTextInput
                iconLeft="phone-outline"
                placeholder="Mobile No"
                value={mobileNo}
                onChangeText={setMobileNo}
                keyboardType="phone-pad"
                maxLength={10}
                editable={isEditMode} // Ensure this is explicitly set
                inputStyle={!isEditMode && styles.disabledInput}
              />
            </FieldRenderer>

            {/* WhatsApp Same As Mobile checkbox */}
            <CustomCheckbox
              label="WhatsApp number same as Mobile No"
              checked={whatsAppSameAsMobile}
              onPress={() => isEditMode && setWhatsAppSameAsMobile(!whatsAppSameAsMobile)}
              style={!isEditMode && styles.disabledCheckbox}
            />

            {/* WhatsApp Number input */}
            <FieldRenderer label="WhatsApp Number" value={whatsAppNumber} editable={isEditMode && !whatsAppSameAsMobile}>
              <CustomTextInput
                iconLeft="whatsapp"
                placeholder="WhatsApp Number"
                value={whatsAppNumber}
                onChangeText={setWhatsAppNumber}
                keyboardType="phone-pad"
                maxLength={10}
                editable={isEditMode && !whatsAppSameAsMobile} // Corrected: only editable if in edit mode AND not same as mobile
                inputStyle={!isEditMode || whatsAppSameAsMobile ? styles.disabledInput : {}} // Visually disable when auto-filled
              />
            </FieldRenderer>

            {/* Email (not editable) */}
            <FieldRenderer label="Email" value={email} editable={false}>
              <CustomTextInput
                iconLeft="email-outline"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={false} // Email remains non-editable
                inputStyle={styles.disabledInput} // Always disabled style
              />
            </FieldRenderer>

            {/* Date of Birth Input - Uses TouchableOpacity to trigger date picker */}
            <FieldRenderer label="Date of Birth" value={dateOfBirth} editable={isEditMode}>
              <TouchableOpacity
                onPress={showDatePicker}
                style={styles.dateInputWrapper}
                disabled={!isEditMode} // Disable touch if not in edit mode
              >
                <CustomTextInput
                  iconLeft="calendar"
                  placeholder="Date of Birth (YYYY-MM-DD)"
                  value={dateOfBirth}
                  editable={false} // Make CustomTextInput itself not editable
                  pointerEvents="none" // Ensure touches go through to TouchableOpacity
                  inputStyle={!isEditMode && styles.disabledInput}
                />
              </TouchableOpacity>
            </FieldRenderer>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirmDate}
              onCancel={hideDatePicker}
              maximumDate={new Date()} // Prevents selecting future dates
            />

            {/* Gender Dropdown */}
            <FieldRenderer label="Gender" value={selectedGender} editable={isEditMode}>
              <DropdownComponent
                data={genderOptions}
                placeholder="Select Gender"
                value={selectedGender}
                onSelect={setSelectedGender}
                icon="gender-male-female"
                searchable={false}
                disabled={!isEditMode}
                inputContainerStyle={!isEditMode && styles.disabledInput}
              />
            </FieldRenderer>

            {/* Residence City */}
            <FieldRenderer label="Residence City" value={residenceCity} editable={isEditMode}>
              <CustomTextInput
                iconLeft="city-variant-outline"
                placeholder="Residence City"
                value={residenceCity}
                onChangeText={setResidenceCity}
                editable={isEditMode}
                inputStyle={!isEditMode && styles.disabledInput}
              />
            </FieldRenderer>

            {/* Education */}
            <FieldRenderer label="Education" value={education} editable={isEditMode}>
              <DropdownComponent
                data={educationOptions}
                placeholder="Education"
                value={education}
                onSelect={setEducation}
                icon="school-outline"
                searchable={true}
                disabled={!isEditMode}
                inputContainerStyle={!isEditMode && styles.disabledInput}
              />
            </FieldRenderer>
            {education === 'Other' && (
              <FieldRenderer label="" value={customEducation} editable={isEditMode}>
                <CustomTextInput
                  iconLeft="school-outline"
                  placeholder="Specify your Education"
                  value={customEducation}
                  onChangeText={setCustomEducation}
                  containerStyle={styles.customEducationInput}
                  editable={isEditMode}
                  inputStyle={!isEditMode && styles.disabledInput}
                />
              </FieldRenderer>
            )}

            {/* College Name */}
            <FieldRenderer label="College Name" value={collegeName} editable={isEditMode}>
              <CustomTextInput
                iconLeft="office-building-outline"
                placeholder="College Name"
                value={collegeName}
                onChangeText={setCollegeName}
                editable={isEditMode}
                inputStyle={!isEditMode && styles.disabledInput}
              />
            </FieldRenderer>

            {/* College City/Village */}
            <FieldRenderer label="College City/Village" value={collegeCityVillage} editable={isEditMode}>
              <CustomTextInput
                iconLeft="map-marker-outline"
                placeholder="College City/Village"
                value={collegeCityVillage}
                onChangeText={setCollegeCityVillage}
                editable={isEditMode}
                inputStyle={!isEditMode && styles.disabledInput}
              />
            </FieldRenderer>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>