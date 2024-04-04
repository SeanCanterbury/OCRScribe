import os
import shutil
from glob import glob
#from tqdm import tqdm
import math
import numpy as np
import cv2
from PIL import Image
#import matplotlib.pyplot as plt
#import splitfolders
import sys
print(sys.executable)
from natsort import natsorted
#YOLO
from ultralytics import YOLO
#ocr
from transformers import AutoTokenizer, AutoModel
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
from transformers import pipeline
import warnings
warnings.filterwarnings('ignore')
import cv2

"""
IF YOU HAVE NOT DOWNLOADRED THE MODEl
os.system('gdown 1VyRACCm-hp55Vnungc6LDWLUyMBnmjMR')
os.system('unzip -q yolo_best')
os.system('cp yolo_model/train/weights/best.pt model.pt')
pip install split-folders tqdm natsort torch torchvision transformers
"""

"""
DOWNLOAD THE DATA FILES
os.system('gdown 1VyRACCm-hp55Vnungc6LDWLUyMBnmjMR')    
os.system('rm -rf yolo && mkdir yolo')
os.system('tar -xzvf Data.tar.gz -C yolo')

"""

model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'model.pt')
model = YOLO(model_path)
save_predict = 'predict_detect'



def yl2xy(lis, image_width, image_height):

  cls, center_X, center_y, width, height = lis
  cls, center_X, center_y, width, height = float(cls), float(center_X), float(center_y), float(width), float(height)

  x1 = (center_X-width/2)*image_width
  x2 = (center_X+width/2)*image_width
  y1 = (center_y-height/2)*image_height
  y2 = (center_y+height/2)*image_height

  # Limiting upto fix number of decimal places
  x1 = format(x1, '.3f')
  y1 = format(y1, '.3f')
  x2 = format(x2, '.3f')
  y2 = format(y2, '.3f')

  return float(x1), float(y1), float(x2), float(y2)



def run_split(image_name):


  img_path_ocr = image_name
  img = cv2.imread(img_path_ocr)
  res_pred = model(img_path_ocr, save_txt=True, save_crop=True, project=save_predict, exist_ok=False, save=True, save_conf=False, conf = 0.70)

  #image
  img_path = glob('predict_detect/predict/*')
  # FILTER OUT ALL THE FILES THAT ARE NOT IMAGES
  img_path = [i for i in img_path if i.endswith('.jpg') or i.endswith('. ') or i.endswith('.png') or i.endswith('.JPG') or i.endswith('.JPEG') or i.endswith('.PNG')]
  img = cv2.imread(img_path[0])
  img_h, img_w, _ = img.shape

  #label
  label_path = glob('predict_detect/predict/labels/*.txt')
  if label_path:
        txt = open(label_path[0]).read()
        txt = txt.split('\n')
  else:
        txt = "no text found"
        print(txt)

    

  #get x y
  objects = list()
  x_y = []
  dic = dict()
  for i in txt[:-1]:
    lis = i.split()
    x1, y1, x2, y2 = yl2xy(lis, img_w, img_h)
    x_y.append([x1, y1, x2, y2])

    #add x1, y1 for sort object
    objects.append((x1, y1))

  #Make the values of y that are close to each other equal
  y = []
  for i in objects:
    y.append(i[1])

  for i in range(len(y)):
    check = y[i]

    for j in range(len(y)):
      check2 = y[j]

      if abs(check-check2) < 2:
        y[j] = int(check)

  objects_sort= []
  for i in range(len(objects)):
    value = list(objects[i])
    value[1] = y[i]
    objects_sort.append(tuple(value))


  #add value to dict
  for i in range(len(objects_sort)):
    key = objects_sort[i]
    value = x_y[i]
    dic.update({key: value})


  #sort text from top left to bottom right
  sorted_objects = sorted(objects_sort, key=lambda obj: (obj[1], obj[0]))

  print(sorted_objects)
  img = cv2.imread(img_path_ocr)
  crop = []
  for key in sorted_objects:
    x1, y1, x2, y2 = dic[key]
    x1, y1, x2, y2 = int(x1)-1, int(y1)-1, int(x2)+1, int(y2)+1
    img_crop = img[y1:y2, x1:x2].copy()
    crop.append(img_crop)



    #!rm -rf ocr_job
    # Check if the directory exists, if it does, remove it
    if os.path.exists('ocr_job'):
        shutil.rmtree('ocr_job')

    # Create the directory again
    if not os.path.exists('ocr_job'):
        os.makedirs('ocr_job')


    #delete all the files in the ocr_job directory
    # for f in os.listdir('ocr_job'):
    #   os.remove('ocr_job/'+f)

    for idx, i in enumerate(crop):
        #cv2.imshow('crop', i)   
        #print('ocr_job/'+str(idx)+'.jpg')
        save_path = f'ocr_job/{idx}.jpg'
        cv2.imwrite(save_path, i)
"""
#split train : validate data
import locale
def getpreferredencoding(do_setlocale = True):
    return "UTF-8"
locale.getpreferredencoding = getpreferredencoding
#!rm -rf /content/yolo_split
splitfolders.ratio("./yolo", output="./yolo_split",
    seed=0, ratio=(.9, .1), group_prefix=None, move=False) # default values
"""

def run_ocr(image_name):
    run_split(image_name)
    #ocr
    processor = TrOCRProcessor.from_pretrained("microsoft/layoutlmv2-base-uncased")
    model = VisionEncoderDecoderModel.from_pretrained("microsoft/layoutlmv2-base-uncased")
    tokenizer = AutoTokenizer.from_pretrained("microsoft/layoutlmv2-base-uncased")
    layoutlmv2 = pipeline("tr-ocr", model=model, tokenizer=tokenizer, processor=processor)
    
    #ocr
    img_path = glob('predict_detect/predict/crops/*.jpg')
    img_path = natsorted(img_path)
    #img_path = img_path[:10]
    for idx, i in enumerate(img_path):
        img = Image.open(i)
        res = layoutlmv2(img)
        print(res)
        print('-----------------------------------')


"""
PART 2: RUN THE OCR

"""
#name = 'microsoft/trocr-base-handwritten'
name = 'microsoft/trocr-base-printed'
processor = TrOCRProcessor.from_pretrained(name)
model_ocr = VisionEncoderDecoderModel.from_pretrained(name)



# load image from the IAM database (actually this model is meant to be used on printed text)
def ocr(img_path):
  image = Image.open(img_path).convert("RGB")

  pixel_values = processor(images=image, return_tensors="pt").pixel_values

  generated_ids = model_ocr.generate(pixel_values)
  generated_text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
  return generated_text
# OCR
# load image from the IAM database (actually this model is meant to be used on printed text)
def ocr(img_path):
  image = Image.open(img_path).convert("RGB")

  pixel_values = processor(images=image, return_tensors="pt").pixel_values

  generated_ids = model_ocr.generate(pixel_values)
  generated_text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
  return generated_text

def batch_ocr():
    img_path = natsorted(glob('predict_detect/predict/crops/text/*'))
    final_txt = ''
    for i in img_path:
        txt = ocr(i)
        print(txt)
        final_txt += txt + ' '
        
    print(final_txt)
    return final_txt


### MAIN
def run_ocr(image_path):
    try:
        print('Spliitting the image into text lines')
        run_split(image_path)
        print('Running OCR on the text lines in order')
        text_output = batch_ocr()
        if not text_output:
            text_output = 'No text detected'
        # SAVE THE IMAGE OUTPUT
        os.system('cp predict_detect/predict/* ./')
        # CLEANUP THE OCR JOB DIRECTORY
        os.system('rm -rf predict_detect/predict*')
        os.system('rm -rf ocr_job')
        
        # CREATE A NEW OCR JOB DIRECTORY
        if not os.path.exists('ocr_job'):
            os.makedirs('ocr_job')
        
        return text_output
    except Exception as e:
        print(e)
        return text_output